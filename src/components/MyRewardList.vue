<template>
  <div v-if="!userState.isLoading && rListSize > 0">
    <div v-for="(reward, index) in rList" :key="index">
      <div class="rh-reward-item">
        <RewardItem
          :userState="userState"
          :rewardDetails="reward"
        />
      </div>
    </div>
  </div>
  <div v-else class="app-body">
    <p>No Reward plans</p>
  </div>
</template>

<script>
import RewardItem from "@/components/RewardItem.vue";

export default {
  props: {
    userState: null,
  },
  components: {
    RewardItem,
  },
  data() {
    return {
      rList: this.userState.customer.MyRewards.target,
      rListSize: this.userState.customer.MyRewards.length,
    };
  },
  created() {
    //console.log(rList);
    //console.log(this.userState.customer.MyRewards.reward.reward.businessName);
  },
  components: {
    RewardItem,
  },
  methods: {
    getRewardList() {
      //this.userState.getRewardList()
    },
  },
};
</script>

<style scoped>
table {
  padding: 0.5rem;
}
th,
td,
tr {
  padding-left: 1rem;
  padding-right: 1rem;
}
</style>
