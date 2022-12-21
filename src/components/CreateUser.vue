<template>
  <h2>CREATE NEW USER</h2>
  <form @submit.prevent="createUser">
    <input v-model="username" type="name" class="form-control" placeholder="Username" required>
    <input v-model="pincode" type="number" class="form-control" placeholder="Pincode" required>
    <button type="submit" class="btn btn-primary">Create</button>
</form>
</template>

<script>
export default {
  props: {
    userState: null
  },
  data() {
      return{
        username:"",
        pincode: ""
      }
   },
   methods: {
     createUser(){
       this.userState.createUser(this.username, this.pincode)

     }
   }
}
</script>

<style>

</style>