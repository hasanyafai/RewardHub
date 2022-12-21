<template>
  <h2>ADD GIFTS</h2>
  <form @submit.prevent="createReward">
    <input v-model="giftName" type="name" class="form-control" placeholder="Gift Name" required>
    <input v-model="thresholdAmount" type="number" class="form-control" placeholder="Threshold Amount" required>
    <button type="submit" class="btn btn-primary">Add</button>
</form>
</template>

<script>
export default {
  props: {
    userState: null
  },
  data() {
      return{
        giftName:"",
        thresholdAmount: ""
      }
   },
   methods: {
     createReward(){
       this.userState.addReward(this.giftName, this.thresholdAmount)

     }
   }
}
</script>

<style>

</style>