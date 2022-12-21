<template>
  <div class="home_header">
    <h3>
      {{
        !userStateStore.isAnonymous ? userStateStore.customer.name : "Anonymous"
      }}
      | <RouterLink to="" @click="showSettings = true">settings</RouterLink>
    </h3>
    <RouterLink
      v-if="userStateStore.isAnonymous"
      to=""
      @click="showCreateAccount = true"
      >(create account to save your points)</RouterLink
    >
    <div class="search">
      <VeeField
        class="searchTerm"
        v-model="theRewardAddress"
        type="name"
        name="theRewardAddress"
        placeholder="Enter Reward address"
        rules="required"
        @keyup="resetMsg"
      />
      <button @click="joinRewardAddress" class="searchButton">Join</button>
    </div>
    <p class="input-err-msg" v-if="userStateStore.loading_msg != ''">
      {{ userStateStore.loading_msg }}
    </p>
  </div>
  <vue-final-modal
    v-model="showSettings"
    classes="modal-container"
    content-class="modal-content"
  >
    <div class="modal__content">
      <div class="app-body">
        <h2>Settings</h2>
        <RouterLink to="/" @click="logout">Logoff</RouterLink>
        <div class="modal__close">
          <button class="rh-btn-normal" @click="showSettings = false">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  </vue-final-modal>

  <vue-final-modal
    v-model="showCreateAccount"
    classes="modal-container"
    content-class="modal-content"
  >
    <div class="modal__content">
      <div class="app-body">
        <RegisterComponent
          :userStateStore="userStateStore"
          :rewardAddress="''"
          :registerText="'Register'"
          :isAnonymousReg="true"
        />
        <div class="modal__close">
          <button class="rh-btn-normal" @click="showCreateAccount = false">
            CLOSE
          </button>
        </div>
      </div>
    </div>
  </vue-final-modal>
  <AppSpinner v-if="userStateStore.isLoading" />
  <div v-else class="rh-home-body">
    <MyRewardList :userState="userStateStore" />
  </div>
  <button v-if="token != ''" @click="joinTopic">join</button>
</template>

<script>
import RegisterComponent from "@/components/RegisterComponent.vue";
import MyRewardList from "@/components/MyRewardList.vue";
import { useUserStateStore } from "@/stores/userState";
import { messaging } from "@/firebase/index";
import { getToken, onMessage } from "firebase/messaging";
import axios from "axios";

export default {
  created(){
    this.activate()
  },
  mounted() {
    onMessage(messaging, (payload)=>{
      console.log("message on client: ", payload);
    })
  },
  components: {
    MyRewardList,
    RegisterComponent,
  },
  data() {
    return {
      userStateStore: useUserStateStore(),
      showSettings: false,
      showCreateAccount: false,
      myRewards: null,
      theRewardAddress: "",
      token: ""
    };
  },
  methods: {
    async activate(){
      this.token = await getToken(messaging, {
        vapidKey:
          "BMPZmWVLzUkxj2KDnr_2ookFiERypidrFTV_DTKLOs_1thnyjUIJux7utbFHWBjucV2or4LMzSkO7A81WyTad3o",
      })
      if(this.token){
        console.log(this.token);
        if(this.token != this.userStateStore.customer.nToken){
          await this.userStateStore.saveUserNotificationToken(this.token)
          // join business notification topic
          //axios.post("http://localhost:3000/call",{myToken: token});
        }
      }
    },
    joinTopic(){
      console.log(this.token);
      axios.post("http://localhost:3000/call",{myToken: this.token});
    },
    resetMsg() {
      this.userStateStore.loading_msg = "";
    },
    async logout() {
      await this.userStateStore.signout().then(async () => {
        await this.$router.push("/").then(() => {
          this.$router.go(0);
        });
      });
    },
    joinRewardAddress() {
        console.log("joining");
        this.userStateStore.joinReward(this.theRewardAddress).then(() => {
          if (this.userStateStore.loading_msg == "") {
            this.$router.go(0);
          }
        });
    },
  },
};
</script>

<style scoped>
.head-button {
  padding: 0.5rem;
  font-size: large;
  font-weight: bold;
  background-color: var(--color-text);
  color: var(--color-background);
}
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  width: 100%;
  height: 100%;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-button:hover {
  background-color: hsla(160, 100%, 37%, 1);
}
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
