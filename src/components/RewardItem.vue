
<template>
  <div class="reward-item-board">
    <div>
      <RouterLink to="" v-if="userState.userType == 'customer'" 
      class="rh-del-btn" @click="deleteReward">
        ❌
      </RouterLink>
    </div>
    <div>
      <h2>
        {{ rewardDetails.plan.businessName }}
      </h2>
    </div>
    <div class="mmc">
      <div class="progress-bar-bg">
      <div class="progress-bar" :style="{ height: progressAmount + '%' }">
        <div class="progress-text">
          {{ rewardDetails.myPoints }}
          <br />
          points
        </div>
      </div>
    </div>
    </div>
    <div class="gifts-progress-bg">
      <div v-bind:class="{ 'gift-stage': rewardDetails.myPoints < rewardDetails.plan.amountMultiplier,
      'gift-stage-earned': rewardDetails.myPoints >= (rewardDetails.plan.amountMultiplier*3),
       }">
        <p class="rh-gift-title">{{ rewardDetails.plan.rewardGifts[2] }}</p>
        <p class="rh-gift-amount">
          {{ rewardDetails.plan.amountMultiplier * 3 }}
          Points
        </p>
      </div>
      <hr />
      <div v-bind:class="{ 'gift-stage': rewardDetails.myPoints < rewardDetails.plan.amountMultiplier,
      'gift-stage-earned': rewardDetails.myPoints >= (rewardDetails.plan.amountMultiplier*2),
       }">
        <p class="rh-gift-title">{{ rewardDetails.plan.rewardGifts[1] }}</p>
        <p class="rh-gift-amount">
          {{ rewardDetails.plan.amountMultiplier * 2 }}
          Points
        </p>
      </div>
      <hr />
      <div v-bind:class="{ 'gift-stage': rewardDetails.myPoints < rewardDetails.plan.amountMultiplier,
      'gift-stage-earned': rewardDetails.myPoints >= rewardDetails.plan.amountMultiplier,
       }">
        <p class="rh-gift-title">{{ rewardDetails.plan.rewardGifts[0] }}</p>
        <p class="rh-gift-amount">
          {{ rewardDetails.plan.amountMultiplier }}
          Points
        </p>
      </div>
    </div>
    <div>
      <div class="rh-timer">
        Expire in
        <br />
        Day(s): {{ rewardDetails.daysToExpire }}
      </div>
    </div>
    <div class="rh-CuCODE">
        {{rewardDetails.CuCODE.slice(0,rewardDetails.CuCODE.length/2) + 
        '&nbsp;&nbsp;' + rewardDetails.CuCODE.slice(rewardDetails.CuCODE.length/2)}}
      </div>
  </div>
</template>

<script>
export default {
  props: {
    userState: null,
    rewardDetails: null
  },
  data() {
    return {
      progressAmount: (this.rewardDetails.myPoints / (this.rewardDetails.plan.amountMultiplier * 3)) * 100,
    };
  },
  methods: {
    async deleteReward() {
      await this.userState.deleteReward(this.rewardDetails.rewardAddress,
      this.rewardDetails.CuCODE, this.rewardDetails.RpID).then(() => {
        this.$router.go(0);
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
