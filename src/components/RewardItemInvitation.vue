
<template>
    <div class="reward-item-board-invitation">
        <div>
        </div>
        <div><h2>{{businessName}}</h2></div>
      <div class="gifts-progress-bg">
        <div class="gift-stage">
        <p class="rh-gift-title">{{ rewardGifts[2] }}</p>
          <p class="rh-gift-amount">
            {{ amountMultiplier * 3 }}
            Points
          </p>
        </div>
        <hr>
        <div class="gift-stage">
            <p class="rh-gift-title">{{ rewardGifts[1] }}</p>
          <p class="rh-gift-amount">
            {{ amountMultiplier * 2 }}
            Points
          </p>
        </div>
        <hr>
        <div class="gift-stage">
          <p class="rh-gift-title">{{ rewardGifts[0] }}</p>
          <p class="rh-gift-amount">
            {{ amountMultiplier }}
            Points
          </p>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  props: {
    businessName: String,
    amountMultiplier: Number,
    rewardGifts: Array,
  },
  data() {
    return {
      progressAmount: 0,
    };
  },
  methods: {
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
