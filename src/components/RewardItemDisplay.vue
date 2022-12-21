
<template>
  <div class="reward-item-board-display">
    <div>
      <RouterLink to="" v-if="userStateStore.userType == 'customer'" 
      class="rh-del-btn" @click="deleteReward">
        ❌
      </RouterLink>
    </div>
    <div>
      <h2>
        {{
          userStateStore.business.customerDetails.name
        }}
      </h2>
    </div>
    <div class="mmc">
      <div class="progress-bar-bg">
      <div class="progress-bar" :style="{ height: progressAmount + '%' }">
        <div class="progress-text">
          {{ userStateStore.business.customerDetails.points }}
          <br />
          points
        </div>
      </div>
    </div>
    </div>
    <div class="gifts-progress-bg">
      <div v-bind:class="{ 'gift-stage': userStateStore.business.customerDetails.points < userStateStore.business.amountMultiplier,
      'gift-stage-earned': userStateStore.business.customerDetails.points >= (userStateStore.business.amountMultiplier*3),
       }">
        <p class="rh-gift-title">{{ userStateStore.business.rewardGifts[2] }}</p>
        <p class="rh-gift-amount">
          {{ userStateStore.business.amountMultiplier * 3 }}
          Points
        </p>
      </div>
      <hr />
      <div v-bind:class="{ 'gift-stage': userStateStore.business.customerDetails.points < userStateStore.business.amountMultiplier,
      'gift-stage-earned': userStateStore.business.customerDetails.points >= (userStateStore.business.amountMultiplier*2),
       }">
        <p class="rh-gift-title">{{ userStateStore.business.rewardGifts[1] }}</p>
        <p class="rh-gift-amount">
          {{ userStateStore.business.amountMultiplier * 2 }}
          Points
        </p>
      </div>
      <hr />
      <div v-bind:class="{ 'gift-stage': userStateStore.business.customerDetails.points < userStateStore.business.amountMultiplier,
      'gift-stage-earned': userStateStore.business.customerDetails.points >= userStateStore.business.amountMultiplier,
       }">
        <p class="rh-gift-title">{{ userStateStore.business.rewardGifts[0] }}</p>
        <p class="rh-gift-amount">
          {{ userStateStore.business.amountMultiplier }}
          Points
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    userStateStore: null,
  },
  data() {
    return {
      progressAmount: (this.userStateStore.business.customerDetails.points / (this.userStateStore.business.amountMultiplier * 3)) * 100,
    };
  },
  methods: {
    async deleteReward() {
      await this.userStateStore.deleteReward(this.userStateStore.business.rewardAddress).then(() => {
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
