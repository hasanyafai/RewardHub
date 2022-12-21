import { createRouter, createWebHistory } from "vue-router";
import { auth, db } from "@/firebase/index";
import { useUserStateStore } from "@/stores/userState";
import pinia from "@/stores/store";
import { USER_COLLECTION } from "@/stores/userState";
import {
  setDoc,
  doc,
  collection,
  getDoc,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { getRedirectResult } from "firebase/auth";
import axios from "axios";

const userState = useUserStateStore(pinia);

const routes = [
  {
    path: "/",
    name: "welcome",
    component: () => import("../views/WelcomeView.vue"),
    meta: { anonymousOnly: true },
  },
  {
    path: "/reward/:id",
    name: "rewardInvitation",
    component: () => import("../views/RewardInvitationView.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../views/DashboardView.vue"),
    meta: { requiresLogin: true },
  },
  {
    path: "/home",
    name: "home",
    component: () => import("../views/HomeView.vue"),
    meta: { requiresLogin: true },
  },
  {
    path: "/rewardsPlan",
    name: "rewardsPlan",
    component: () => import("../views/RewardsPlanView.vue"),
    meta: { requiresLogin: true },
  },
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404Page.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

router.beforeEach(async (to, from) => {
  userState.isNavLoading = true;
  try {
    await auth.onAuthStateChanged(async (user) => {
      //console.log(user);
      if (user) {
        userState.isAnonymous = user.isAnonymous
        userState.isLoggedIn = true;
        await getDoc(doc(db, USER_COLLECTION, user.uid)).then(
          async (dbUser) => {
            if (dbUser.exists()) {
              userState.loading_msg = ""
              if (dbUser.data().userType === "business") {
                userState.isActive = dbUser.data().isActive;
                userState.userType = dbUser.data().userType;
                userState.uid = dbUser.id;
                userState.email = dbUser.data().email;
                userState.business.businessName = dbUser.data().businessName;
                userState.business.rewardGifts = dbUser.data().rewardGifts;
                userState.business.amountMultiplier =
                  dbUser.data().amountMultiplier;
                userState.business.rewardAddress = 
                dbUser.data().rewardAddress ? dbUser.data().rewardAddress : '';
                userState.business.isActive = dbUser.data().isActive;
              } else if (dbUser.data().userType === "customer") {
                //console.log(dbUser.data());
                userState.userType = dbUser.data().userType;
                userState.uid = dbUser.id;
                userState.email = dbUser.data().email;
                userState.customer.name = dbUser.data().name;
                userState.customer.nToken = dbUser.data().notificationToken;
                if(dbUser.data().rewardPlans)
                {await userState.getMyRewards(Object.keys(dbUser.data().rewardPlans)
                .map(key=>({id: key, ...dbUser.data().rewardPlans[key]})))}
              }
            } else {
              // console.log(user);
              // if (
              //   user.reloadUserInfo.providerUserInfo[0].providerId == "password"
              // ) {
              //   let bn = localStorage.getItem("businessName");
              //   if (bn) {
              //     userState.createBusinessAccountinDB(bn, user.uid, user.email);
              //   }
              // } else {
              //   // user created via google signin,, register in firestore
              //   await setDoc(doc(db, USER_COLLECTION, dbUser.id), {
              //     userType: "customer",
              //     displayname: user.displayName,
              //     email: user.email,
              //     acceptUserTC: true,
              //   });
              // }
            }
          }
        );
      }

      await getRedirectResult(auth).then((result) => {
        if(result){
          if(result.providerId == "google.com"){
            router.push("/home");
          }
          userState.isLoading = false;
        }
        if (
          result &&
          to.name === "rewardInvitation" &&
          userState.userType === "customer"
        ) {
          try {
            userState.joinReward(to.params.id).then(() => {
              router.push("/home");
            });
          } catch (err) {
            console.log(err);
          }
        }
      });

      if (to.meta.requiresLogin && !user) {
        router.push("/");
      }

      if (to.name === "rewardInvitation") {
        if (userState.userType === "business") {
          router.push("/dashboard");
        }
        if (userState.userType === "customer") {
          if (userState.checkIfRewardIsJoined(to.params.id)) {
            userState.isLoading = false;
            router.push("/home");
          }
        }
      }

      if (to.name === "rewardCustomer" && userState.userType != "business") {
        router.push("/");
      }

      if (
        to.name === "dashboard" &&
        userState.isLoggedIn &&
        userState.userType === "customer"
      ) {
        router.push("/home");
      }

      if (
        to.name === "home" &&
        userState.isLoggedIn &&
        userState.userType === "business"
      ) {
        router.push("/dashboard");
      }

      if (to.meta.anonymousOnly) {
        if (userState.userType === "business") {
          router.push("/dashboard");
        } else if (userState.userType === "customer") {
          router.push("/home");
        }
      }
      userState.isNavLoading = false;
      userState.isLoading = false;
    });
  } catch (err) {
    console.log(err);
  }
});

export default router;
