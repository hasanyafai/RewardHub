<template>
  <div>
      <h2>USERS LIST
          <button @click="getUserList">Refresh</button>
      </h2>
      <table>
          <thead>
              <th>Username</th>
              <th>Pincode</th>
          </thead>
          <AppSpinner v-if="userState.isLoading" />
          <tbody v-else>
              <tr v-for="user in userState.userList" :key="user.id">
                  <td>{{user.username}}</td>
                  <td>****</td>
              </tr>
          </tbody>
      </table>
  </div>
</template>

<script>
export default {
    props: {
    userState: null
  },
    methods: {
        getUserList(){
            this.userState.getUsersList()
        }
    }
}
</script>

<style scoped>
table{
    padding: 0.5rem;
}
th, td, tr{
    padding-left: 1rem;
    padding-right: 1rem;
}
</style>