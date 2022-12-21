<template>
  <AppSpinner v-if="userStateStore.isLoading || reward == null" />
  <div v-else>
    <div v-if="reward.isRewardActive">
      <RewardItemInvitation
      :businessName="reward.businessName"
      :amountMultiplier="reward.amountMultiplier"
      :rewardGifts="reward.rewardGifts"
    />

    <br />
    <div>
      <button
        v-if="
          userStateStore.isLoggedIn && userStateStore.userType === 'customer'
        "
        class="rh-button"
        @click="joinReward"
      >
        Join
      </button>
      <div v-else>
        <button class="rh-big-btn" @click="anonymousLoginAndJoinReward">
          Anonymous Login & Join
        </button>
        <br>
        <RegLoginComponent :userStateStore="userStateStore"
        :rewardAddress="thisRA" :loginText="'Login and Join '+reward.businessName"
      :registerText="'Register and join '+reward.businessName"
      :isAnonymousReg="false" />
      </div>
    </div>
    </div>
    <div v-else class="form">
      <h2>Reward plan is not ready yet</h2>
      <button
        class="rh-button"
        @click="(goHome)"
      >
        Go home
      </button>
    </div>
  </div>
  <div class="home_header">Terms & conditions</div>
</template>

<script>
import RewardItemInvitation from "@/components/RewardItemInvitation.vue";
import RegLoginComponent from "@/components/RegLoginComponent.vue";
import { useUserStateStore } from "@/stores/userState";

export default {
  components: {
    RewardItemInvitation,
    RegLoginComponent
  },
  data() {
    return {
      reward: null,
      thisRA: this.$route.params.id,
      userStateStore: useUserStateStore(),
      formActive: "login",
    loginForm: {
      email: "",
      password: "",
    },
    registerForm: {
      email: "",
      password: "",
      name: "",
    },
    passwordRegex:
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%-*#?&]{8,}$/,
    };
  },
  async created() {
    if (this.thisRA != "") {
      await this.userStateStore
        .getRewardByRA(this.thisRA)
        .then(async (res) => {
          console.log(res);
          if (res.businessName != "") {
            this.reward = res;
          } else {
            await this.$router.push("/").then(() => {
              this.$router.go(0);
            });
          }
        });
    }
  },
  methods: {
    async joinReward() {
      this.userStateStore.joinReward(this.thisRA).then(() => {
        this.$router.push("/home");
      });
    },
    goHome() {
      this.$router.push("/home");
    },
    async anonymousLoginAndJoinReward() {
      await this.userStateStore.anonymousLogin(this.thisRA).then(async () => {
        await this.$router.push("/").then(() => {
          this.$router.go(0);
        });
      });
    },
  },
};
</script>

<style>
@media (min-width: 1024px) {
  .rewardView {
    min-height: 100vh;
    display: table;
    align-items: center;
    padding-top: 10rem;
  }
}
</style>
