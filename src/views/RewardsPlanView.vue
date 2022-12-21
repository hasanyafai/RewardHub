
<template>
  <div>
    <h1>Reward Plan</h1>
    <RouterLink to="/dashboard">Back to Dashboard</RouterLink>
  </div>
  <AppSpinner v-if="userStateStore.isLoading" />
  <div class="app-body" v-else>
    <h2>3 Gifts for Trippled Spending</h2>
    <br />
    <VeeForm @submit="saveRewardPlan">
      <div class="plan-board">
        <div class="progress-bar-bg">
          <div
            class="progress-bar"
            :style="{ height: progressAmount + '%' }"
          ></div>
        </div>
        <div class="gifts-progress-bg">
          <div class="gift-stage">
            <VeeField
              class="rh-input"
              type="text"
              name="thirdGift"
              :maxlength="giftTextLength"
              v-model="rewardGifts[2]"
              rules="required"
              @focus="progressAmount = 100"
            />
            <p>{{ amountMultiplier * 3 }} Points</p>
            <VeeErrorMessage name="thirdGift">
              <p class="input-err-msg">Please enter third gift</p>
            </VeeErrorMessage>
          </div>
          <div class="gift-stage">
            <VeeField
              class="rh-input"
              type="text"
              name="secondGift"
              :maxlength="giftTextLength"
              v-model="rewardGifts[1]"
              rules="required"
              @focus="progressAmount = 66.667"
            />
            <p>{{ amountMultiplier * 2 }} Points</p>
            <VeeErrorMessage name="secondGift">
              <p class="input-err-msg">Please enter second gift</p>
            </VeeErrorMessage>
          </div>
          <div class="gift-stage">
            <VeeField
              class="rh-input"
              type="text"
              name="firstGift"
              :maxlength="giftTextLength"
              v-model="rewardGifts[0]"
              rules="required"
              @focus="progressAmount = 33.33"
            />
            <p>{{ amountMultiplier * 1 }} Points</p>
            <VeeErrorMessage name="firstGift">
              <p class="input-err-msg">Please enter first gift</p>
            </VeeErrorMessage>
          </div>
          <div class="rh-amount-multiplier">
            <label for="amountMultiplier"
              >Points multiplier: {{ amountMultiplier }}
            </label>
            <br />
            <VeeField
              name="amountMultiplier"
              v-model="amountMultiplier"
              type="range"
              :min="2"
              :max="10"
              rules="required"
              style="background-color: transparent"
            />
          </div>
          <button type="submit" class="rh-button">SAVE</button>
        </div>
      </div>
    </VeeForm>
  </div>
</template>

<script>
import { useUserStateStore } from "@/stores/userState";

export default {
  data() {
    return {
      userStateStore: useUserStateStore(),
      amountMultiplier: 2,
      rewardGifts: [],
      giftTextLength: 25,
      progressAmount: 0,
    };
  },
  created() {
    this.amountMultiplier = this.userStateStore.business.amountMultiplier
        ? this.userStateStore.business.amountMultiplier
        : 2
    this.rewardGifts = this.userStateStore.business.rewardGifts
        ? this.userStateStore.business.rewardGifts
        : []
  },
  methods: {
    saveRewardPlan() {
      this.userStateStore
        .saveRewardPlan(this.rewardGifts, this.amountMultiplier)
        .then(async () => {
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
