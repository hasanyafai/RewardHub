import { defineStore } from "pinia";

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  signInAnonymously,
  getRedirectResult,
  GoogleAuthProvider,
  signOut,
  sendEmailVerification,
  EmailAuthProvider,
  linkWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  setDoc,
  arrayUnion,
  deleteField,
  doc,
  where,
  getDoc,
  updateDoc,
  increment,
  getDocs,
  deleteDoc,
  collection,
  query,
} from "firebase/firestore";
import { auth, db } from "@/firebase/index";
import { getMessaging } from "firebase/messaging";
import axios from "axios";
import { getFunctions, httpsCallable } from "firebase/functions";

export const USER_COLLECTION = "users_collection";
export const JOINED_CUSTOMERS_COLLECTION = "joinedCustomers_collection";

export const useUserStateStore = defineStore("UserStateStore", {
  state: () => {
    return {
      uid: "",
      userType: "",
      email: "",
      loading_msg: "",
      isLoggedIn: false,
      isLoading: false,
      isNavLoading: true,
      isAnonymous: true,
      customer: {
        name: "",
        nToken: "",
        joinedRewardIds: [],
        MyRewards: [],
      },
      business: {
        isActive: false,
        businessName: "",
        rewardGifts: [],
        amountMultiplier: 10,
        customerList: [],
        businessInv: "",
        rewardAddress: "",
        customerDetails: {
          id: "",
          email: "",
          CuCODE: "",
          name: "",
          points: 0,
          daysToExpire: 0,
          nToken: "",
        },
      },
    };
  },
  getters: {},
  actions: {
    async signout() {
      this.isLoading = true;
      return await signOut(auth).then(() => {
        this.isLoading = false;
      });
    },
    async anonymousLogin(rewardAddress = "") {
      this.isLoading = true;
      // const provider = new GoogleAuthProvider();
      // await signInWithRedirect(auth, provider);
      await signInAnonymously(auth)
        .then(async (res) => {
          console.log(res.user.uid);
          await setDoc(doc(db, USER_COLLECTION, res.user.uid), {
            userType: "customer",
            name: "Anonymous",
            email: "",
            acceptUserTC: true,
            rewardPlans: {}
          }).then(async () => {
            //join reward plan if any
            if (rewardAddress != "") {
              await this.joinReward(rewardAddress);
            }
          });
          this.isLoading = false;
        })
        .catch((error) => {
          this.isLoading = false;
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
        });
    },
    async signin(email, password) {
      this.isLoading = true;
      await signInWithEmailAndPassword(auth, email, password).catch((error) => {
        console.log(error.code);
        if (error.code == "auth/user-not-found") {
          this.loading_msg =
            "Sorry, we don't have account with the provided email";
        }
        if (error.code == "auth/wrong-password") {
          this.loading_msg = "The password you entered is not correct";
        }
        this.isLoading = false;
      });
    },
    async registerBusiness(email, password, businessName, rewardAddress) {
      this.isLoading = true;
      this.loading_msg = "";
      //check rewardAddress availability
      await getDocs(
        query(
          collection(db, USER_COLLECTION),
          where("rewardAddress", "==", rewardAddress)
        )
      ).then(async (res) => {
        console.log(res.size);
        if (res.size > 0) {
          //error
          this.isLoading = false;
          this.loading_msg = "The reward address is already taken.";
          return;
        } else {
          await createUserWithEmailAndPassword(auth, email, password)
            .then(async (data) => {
              localStorage.setItem("businessName", businessName);
              await this.createBusinessAccountinDB(
                businessName,
                data.user.uid,
                email,
                rewardAddress
              );
            })
            .catch((error) => {
              this.isLoading = false;
              if (error.code == "auth/email-already-in-use") {
                this.loading_msg = "The email you entered is already used";
              }
            });
        }
      });
    },
    async registerCustomer(email, password, name, isAnonymousReg) {
      this.isLoading = true;
      this.loading_msg = "";
      if (isAnonymousReg) {
        await linkWithCredential(
          auth.currentUser,
          EmailAuthProvider.credential(email, password)
        )
          .then(async (data) => {
            localStorage.setItem("customerName", name);
            await setDoc(doc(db, USER_COLLECTION, data.user.uid), {
              userType: "customer",
              email: email,
              name: name,
              acceptUserTC: true,
              rewardPlans: {}
            });
          })
          .catch((error) => {
            console.log(error);
            this.loading_msg = error.code;
            this.isLoading = false;
            if (error.code == "auth/email-already-in-use") {
              this.loading_msg = "The email you entered is already used";
            }
          });
      } else {
        await createUserWithEmailAndPassword(auth, email, password)
          .then(async (data) => {
            localStorage.setItem("customerName", name);
            await setDoc(doc(db, USER_COLLECTION, data.user.uid), {
              userType: "customer",
              email: email,
              name: name,
              acceptUserTC: true,
            });
          })
          .catch((error) => {
            this.isLoading = false;
            if (error.code == "auth/email-already-in-use") {
              this.loading_msg = "The email you entered is already used";
            }
          });
      }
    },
    async resetPassword(email) {
      this.loading_msg = "";
      let isBusinessAccount = false;
      const q = query(
        collection(db, USER_COLLECTION),
        where("email", "==", email)
      );
      await getDocs(q).then(async (userDoc) => {
        userDoc.forEach(async (docFound) => {
          if (docFound.data().userType == "business") {
            isBusinessAccount = true;
          }
        });
        if (isBusinessAccount) {
          await sendPasswordResetEmail(auth, email)
            .then(() => {
              this.loading_msg = "Reset link has been sent to " + email;
            })
            .catch((error) => {
              this.loading_msg = error.code;
              // ..
            });
        } else {
          this.loading_msg = "the email " + email + " is not registered";
        }
      });
    },
    async saveUserNotificationToken(token) {
      await updateDoc(doc(db, USER_COLLECTION, this.uid), {
        notificationToken: token,
      });
    },
    async createBusinessAccountinDB(
      businessName,
      userUid,
      email,
      rewardAddress
    ) {
      //create user account
      await setDoc(doc(db, USER_COLLECTION, userUid), {
        userType: "business",
        email: email,
        businessName: businessName,
        acceptUserTC: true,
        rewardAddress: rewardAddress,
        isActive: false,
      });
    },
    async saveRewardPlan(rewardGifts, amountMultiplier) {
      this.isLoading = true;
      if (this.business.isActive) {
        await updateDoc(doc(db, USER_COLLECTION, this.uid), {
          rewardGifts: rewardGifts,
          amountMultiplier: amountMultiplier,
        }).then(() => {
          this.business.rewardGifts = rewardGifts;
          this.business.amountMultiplier = amountMultiplier;
          this.isLoading = false;
        });
      } else {
        await updateDoc(doc(db, USER_COLLECTION, this.uid), {
          rewardGifts: rewardGifts,
          amountMultiplier: amountMultiplier,
          isActive: true,
        }).then(() => {
          this.business.rewardGifts = rewardGifts;
          this.business.amountMultiplier = amountMultiplier;
          this.isLoading = false;
          this.business.isActive = true;
        });
      }
    },
    async getCustomerDetails(CuCODE) {
      this.isLoading = true;
      this.loading_msg = "";

      await getDoc(
        doc(db, USER_COLLECTION, this.uid, JOINED_CUSTOMERS_COLLECTION, CuCODE)
      ).then(async (res) => {
        if (res.exists()) {
          this.business.customerDetails.id = res.data().customerID;
          this.business.customerDetails.CuCODE = res.id;

          //get customer personal info
          await getDoc(doc(db, USER_COLLECTION, res.data().customerID))
            .catch((err) => {
              console.log(err.code);
            })
            .then((res) => {
              if (res.exists()) {
                console.log(this.business.rewardAddress);
                this.business.customerDetails.name = res.data().name;
                this.business.customerDetails.nToken =
                  res.data().notificationToken;
                this.business.customerDetails.email = res.data().email;
                const rewardPlans = Object.keys(res.data().rewardPlans)
                .map(key=>({id: key, ...res.data().rewardPlans[key]}))
                let rewardPlan = null;
                for(let i=0; i< rewardPlans.length; i++){
                  if(rewardPlans[i].id === this.business.rewardAddress){
                    rewardPlan = rewardPlans[i];
                    break;
                  }
                }

                console.log(rewardPlan);
                const date1 = new Date().getTime();
                const date2 = rewardPlan
                .lastProcurementDate.toDate().getTime();
                const diffTime = Math.abs(date2 - date1);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                this.business.customerDetails
                .points = rewardPlan.points;
                this.business.customerDetails.daysToExpire = 7 - diffDays;
              } else {
                this.loading_msg = "❌ Customer didn't join the reward plan";
              }
              this.isLoading = false;
            });
        } else {
          this.isLoading = false;
          //return customer not found
          this.loading_msg = "❌ Incorrect code ";
        }
      });
    },
    async givePoints(pointsAmount) {
      this.isLoading = true;
      await setDoc(
        doc(db, USER_COLLECTION, this.business.customerDetails.id),
        {
          rewardPlans: {
            [this.business.rewardAddress]: {
              points: increment(pointsAmount),
              lastProcurementDate: new Date(),
            },
          },
        },
        { merge: true }
      )
        .catch((err) => {
          this.isLoading = false;
          console.log(err.code);
        })
        .then(() => {
          //this.getGiftList();
          this.loading_msg = "✅ Points added";
          this.isLoading = false;
          this.business.customerDetails.points += pointsAmount;
        });
    },
    async honorGift(giftNum) {
      this.isLoading = true;
      await setDoc(
        doc(db, USER_COLLECTION, this.business.customerDetails.id),
        {
          rewardPlans: {
            [this.business.rewardAddress]: {
              points: increment(-(giftNum * this.business.amountMultiplier)),
              lastProcurementDate: new Date(),
            },
          },
        },
        { merge: true }
      )
        .catch((err) => {
          this.isLoading = false;
          console.log(err.code);
        })
        .then(() => {
          //this.getGiftList();
          this.loading_msg =
            "🎖️ Customer Honored: " + this.business.rewardGifts[giftNum - 1];
          this.isLoading = false;
          this.business.customerDetails.points -=
            giftNum * this.business.amountMultiplier;
        });
    },
    async deleteReward(rewardAddress, CuCODE, RpID) {
      this.isLoading = true;
      await updateDoc(
        doc(db, USER_COLLECTION, this.uid),
        {
          [`rewardPlans.${rewardAddress}`]: deleteField()
        },
        { merge: true }
      ).then(async () => {
        await deleteDoc(
          doc(db, USER_COLLECTION, RpID, JOINED_CUSTOMERS_COLLECTION, CuCODE)
        );
      });

      this.isLoading = false;
    },
    checkIfRewardIsJoined(rewardAddress) {
      if (this.customer.joinedRewardIds) {
        for (let i = 0; i < this.customer.joinedRewardIds.length; i++) {
          if (this.customer.joinedRewardIds[i].RA === rewardAddress) {
            return true;
          }
        }
      }
      return false;
    },
    async joinReward(rewardAddress) {
      this.loading_msg = "";
      this.isLoading = true;
      //check RA if joined
      if (this.checkIfRewardIsJoined(rewardAddress)) {
        this.loading_msg = "Reward code you entered is already joined.";
        this.isLoading = false;
        return null;
      }

      const q = query(
        collection(db, USER_COLLECTION),
        where("rewardAddress", "==", rewardAddress)
      );
      const querySnapshot = await getDocs(q);
      let businessId = "";
      let isRPActive = false;
      querySnapshot.forEach(async (docFound) => {
        if (docFound.data()) {
          businessId = docFound.id;
          isRPActive = docFound.data().isActive;
        }
      });
      if (businessId != "") {
        if (isRPActive) {
          //create CuCODE and check if not used
          var canUseCuCODE = false;
          const random = (length = 8) => {
            // Declare all characters
            let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            // Pick characers randomly
            let str = "";
            for (let i = 0; i < length; i++) {
              str += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return str;
          };
          var CuCODE = random(4);

          while (!canUseCuCODE) {
            canUseCuCODE = true;
            await getDoc(
              doc(
                db,
                USER_COLLECTION,
                businessId,
                JOINED_CUSTOMERS_COLLECTION,
                CuCODE
              )
            ).then((res) => {
              if (res.exists()) {
                canUseCuCODE = false;
                CuCODE = random(4);
              } else {
                canUseCuCODE = true;
              }
            });
          }

          return await setDoc(
            doc(
              db,
              USER_COLLECTION,
              businessId,
              JOINED_CUSTOMERS_COLLECTION,
              CuCODE
            ),
            {
              joinDate: new Date(),
              customerID: this.uid,
              name: this.customer.name,
            },
            { merge: true }
          ).then(async () => {
            await setDoc(
              doc(db, USER_COLLECTION, this.uid),
              {
                rewardPlans: {
                  [rewardAddress]: {
                    RpID: businessId,
                    joinDate: new Date(),
                    points: 0,
                    lastProcurementDate: new Date(),
                    CuCODE: CuCODE,
                  },
                },
              },
              { merge: true }
            ).then(async () => {
              
            });
          });
        } else {
          this.loading_msg = "Reward code you entered is not active.";
          this.isLoading = false;
          return null;
        }
      } else {
        this.loading_msg = "Reward code you entered is not exist.";
        this.isLoading = false;
        return null;
      }
    },
    async getRewardByID(RpID) {
      this.isLoading = true;
      return await getDoc(doc(db, USER_COLLECTION, RpID)).then((res) => {
        if (res.exists()) {
          let businessName = res.data().businessName;
          let rewardGifts = res.data().rewardGifts;
          let amountMultiplier = Number(res.data().amountMultiplier);
          let isRewardActive = res.data().isActive;
          this.isLoading = false;
          return {
            businessName,
            rewardGifts,
            amountMultiplier,
            isRewardActive,
          };
        } else {
          this.isLoading = false;
          return null;
        }
      });
    },
    async getRewardByRA(rewardAddress) {
      this.isLoading = true;
      let businessName = "";
      let rewardGifts = [];
      let isRewardActive = false;
      let amountMultiplier = 0;
      if (rewardAddress != "") {
        const q = query(
          collection(db, USER_COLLECTION),
          where("rewardAddress", "==", rewardAddress)
        );
        return await getDocs(q).then((result) => {
          result.forEach((doc) => {
            if (doc.data()) {
              businessName = doc.data().businessName;
              rewardGifts = doc.data().rewardGifts;
              amountMultiplier = Number(doc.data().amountMultiplier);
              isRewardActive = doc.data().isActive;
            } else {
              return null;
            }
          });
          this.isLoading = false;
          return {
            businessName,
            rewardGifts,
            amountMultiplier,
            isRewardActive,
          };
        });
      }
    },
    getAllActiveJoinedRewardIds(rewardPlans) {
      const rewards = [];
      rewardPlans.forEach((doc) => {
        console.log(doc.lastProcurementDate.toDate().getTime());
          const date1 = new Date().getTime();
          const date2 = doc.lastProcurementDate.toDate().getTime();
          const diffTime = Math.abs(date2 - date1);
          console.log(doc);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if(diffTime >= 0){
            rewards.push({
              RA: doc.id,
              RpID: doc.RpID,
              points: doc.points,
              daysToExpire: 7 - diffDays,
              CuCODE: doc.CuCODE,
            });
          }
      });
      return rewards;
    },
    async getMyRewards(rewardPlans) {
      this.isLoading = true;
      const MyRewards = [];
      let rewardList = this.getAllActiveJoinedRewardIds(rewardPlans)
      console.log(rewardList);
      if (rewardList.length > 0) {
        for (let i = 0; i < rewardList.length; i++) {
          MyRewards.push({
            RpID: rewardList[i].RpID,
            rewardAddress: rewardList[i].RA,
            plan: await this.getRewardByID(
              rewardList[i].RpID
            ),
            myPoints: rewardList[i].points,
            daysToExpire: rewardList[i].daysToExpire,
            CuCODE: rewardList[i].CuCODE,
          });
        }
        this.customer.MyRewards = new Proxy(MyRewards, {
          get(target, prop, receiver) {
            if (prop === "target") {
              return target;
            } else if (prop === "length") {
              return target.length;
            }
            return null;
          },
        });
      }
      console.log(this.customer.MyRewards);
      this.isLoading = false;
    },
    generateNotificationMsg(cuPoints) {
      let msg = { title: "", body: "" };
      switch (cuPoints) {
        case cuPoints == this.business.amountMultiplier * 3:
          msg.title = "You Won " + this.business.rewardGifts[2];
          msg.body = "Visit " + this.business.businessName + "and claim it !";
          break;
        case cuPoints >= this.business.amountMultiplier * 2:
          msg.title = "You Won " + this.business.rewardGifts[1];
          msg.body = "Visit " + this.business.businessName + "and claim it !";
          break;
        case cuPoints >= this.business.amountMultiplier:
          msg.title = "You Won " + this.business.rewardGifts[0];
          msg.body = "Visit " + this.business.businessName + "and claim it !";
          break;
        default:
          msg.title =
            this.business.amountMultiplier -
            cuPoints +
            " to win " +
            this.business.rewardGifts[0];
          msg.body = "Visit " + this.business.businessName + "and get points";
      }
      return msg;
    },
    async generateJoinedUsersMsg() {
      const functions = getFunctions();
      const sendNotification = httpsCallable(functions, "sendNotification");
      const payload = [];
      let itr = 0;
      const q = query(
        collection(db, USER_COLLECTION, this.uid, JOINED_CUSTOMERS_COLLECTION)
      );
      return getDocs(q).then(async (querySnapshot) => {
        return querySnapshot.forEach(async (res) => {
          if (res.data()) {
            console.log(querySnapshot.size);
            const points = res.data().points ? res.data().points : 0;
            await getDoc(doc(db, USER_COLLECTION, res.data().customerID)).then(
              (user) => {
                const msg = this.generateNotificationMsg(points);
                payload.push({
                  token: user.data().notificationToken,
                  notification: {
                    title: msg.title,
                    body: msg.body,
                  },
                  data: {
                    body: msg.body,
                  },
                  webpush: {
                    fcm_options: {
                      link: "https://rhubapp.com/",
                    },
                  },
                });
              }
            );
          }
          itr++;
          if (itr >= querySnapshot.size) {
            console.log("&&&");
            if (payload.length > 0) {
              console.log(payload);
              sendNotification({ payload })
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }
          }
        });
      });
    },
  },
});
