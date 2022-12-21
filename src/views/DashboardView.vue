<template>
  <div class="home_header">
    <div>
      <vue-qrcode
        :value="qrRewardAddress"
        :scale="8"
        :color="{ dark: '#00FF00', light: '#FF0000' }"
      />
    </div>
    <div class="rh-business-header">
      <div>
        <h1 v-if="userStateStore.business.rewardAddress != ''">
          {{ userStateStore.business.rewardAddress }}
        </h1>
        <h3>{{ userStateStore.business.businessName }}</h3>
      </div>
      <nav class="rh-business-nav">
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <br />
        <RouterLink to="/rewardsPlan">Rewards Plan</RouterLink>
        <br />
        <RouterLink to="/" @click="logout">Logoff</RouterLink>
      </nav>
    </div>
  </div>
  <div class="app-body">
    <br />
    <button
      class="rh-big-btn"
      v-if="!userStateStore.business.isActive"
      @click="goToRewardPlan"
    >
      MAKE REWARD PLAN
    </button>
    <div v-else class="form">
      <div
        v-if="
          userStateStore.business.customerDetails.id != '' &&
          userStateStore.loading_msg == '' &&
          !userStateStore.isLoading
        "
      >
        <RewardItemDisplay :userStateStore="userStateStore" />
        <div>
          <button @click="notifiyCu">notifie</button>
          <button
            class="rh-btn-normal"
            :disabled="
              userStateStore.business.customerDetails.points + 1 >
              userStateStore.business.amountMultiplier * 3
            "
            @click="givePoints(1)"
          >
            GIVE 1 POINT
          </button>
          <button
            class="rh-btn-normal"
            :disabled="
              userStateStore.business.customerDetails.points + 2 >
              userStateStore.business.amountMultiplier * 3
            "
            @click="givePoints(2)"
          >
            GIVE 2 POINTS
          </button>
          <hr />
          <h3>HONOR REWARD</h3>
          <button
            class="rh-btn-normal"
            :disabled="
              userStateStore.business.customerDetails.points <
              userStateStore.business.amountMultiplier * 3
            "
            @click="honorGift(3)"
          >
            HONOR: {{ userStateStore.business.rewardGifts[2] }}
          </button>
          <button
            class="rh-btn-normal"
            :disabled="
              userStateStore.business.customerDetails.points <
              userStateStore.business.amountMultiplier * 2
            "
            @click="honorGift(2)"
          >
            HONOR: {{ userStateStore.business.rewardGifts[1] }}
          </button>
          <button
            class="rh-btn-normal"
            :disabled="
              userStateStore.business.customerDetails.points <
              userStateStore.business.amountMultiplier
            "
            @click="honorGift(1)"
          >
            HONOR: {{ userStateStore.business.rewardGifts[0] }}
          </button>
        </div>
        <button class="rh-close-btn" @click="closeCheckCustomer">Cancel</button>
      </div>

      <VeeForm v-else @submit="checkCustomer">
        <h3>REWARD CUSTOMER</h3>
        <br />
        <VeeField
          class="rh-input"
          v-model="CuCODE"
          @input="(val) => (CuCODE = CuCODE.toUpperCase())"
          name="Customer Code"
          type="text"
          placeholder="Insert Customer code"
          rules="required"
        />
        <VeeErrorMessage name="Customer Code" class="input-err-msg" />
        <button type="submit" class="rh-btn-normal">CHECK CUSTOMER</button>
        <AppSpinner v-if="userStateStore.isLoading" />
        <h2 v-else>{{ userStateStore.loading_msg }}</h2>
      </VeeForm>
    </div>
  </div>
  <button @click="sendMsg">heeee</button>
</template>

<script>
import RewardItemDisplay from "@/components/RewardItemDisplay.vue";
import { useUserStateStore } from "@/stores/userState";
import { useRoute, useRouter } from "vue-router";
export default {
  props: {},
  data() {
    return {
      userStateStore: useUserStateStore(),
      CuCODE: "",
      qrRewardAddress: "",
      router: useRouter(),
    };
  },
  created() {
    if (this.userStateStore.business.rewardAddress != "") {
      this.qrRewardAddress =
        "https://rhubapp.com/reward/" +
        this.userStateStore.business.rewardAddress;
    }
  },
  components: {
    RewardItemDisplay,
  },
  methods: {
    async notifiyCu() {
      this.userStateStore.sendNotification(
        this.userStateStore.business.customerDetails.nToken
      );
    },
    async logout() {
      await this.userStateStore.signout().then(async () => {
        await this.$router.push("/").then(() => {
          this.$router.go(0);
        });
      });
    },
    async goToRewardPlan() {
      await this.$router.push("/rewardsPlan");
    },
    async sendMsg() {
      await this.userStateStore.generateJoinedUsersMsg()
    },
    checkCustomer() {
      this.userStateStore.getCustomerDetails(this.CuCODE);
    },
    givePoints(pointsAmount) {
      this.userStateStore.givePoints(pointsAmount);
    },
    honorGift(giftNum) {
      this.userStateStore.honorGift(giftNum);
    },
    closeCheckCustomer() {
      this.userStateStore.business.customerDetails.id = "";
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
