<template>
  <VeeForm @submit="doRegister">
    <h2>Register Customer</h2>
    <br>
    <label for="register name">Name</label>
    <VeeField
      class="rh-input"
      v-model="registerForm.name"
      type="name"
      name="register name"
      placeholder="name"
      rules="required"
    />
    <div class="message">
      <VeeErrorMessage name="register name" />
    </div>
    <label for="Register Email">Email</label>
    <VeeField
      class="rh-input"
      v-model="registerForm.email"
      type="email"
      name="Register Email"
      placeholder="Email"
      rules="required|email"
    />
    <div class="message">
      <VeeErrorMessage name="Register Email" />
    </div>
    <label for="Register Password">Password</label>
    <VeeField
      class="rh-input"
      v-model="registerForm.password"
      type="password"
      name="Register Password"
      placeholder="Password"
      :rules="{ required: true, regex: passwordRegex }"
    />
    <div class="message">
      <VeeErrorMessage name="Register Password" />
    </div>
    <AppSpinner v-if="userStateStore.isLoading" />
    <p class="input-err-msg" v-else>{{ userStateStore.loading_msg }}</p>

    <div class="rh-list-normal">
        <p>Password should have:</p>
        <li>8 characters</li>
        <li>one letter</li>
        <li>one number</li>
        <li>one special character</li>
      </div>

    <button type="submit" class="rh-btn-normal">{{ registerText }}</button>
    <br />
  </VeeForm>
</template>

<script>
export default {
  components: {},
  props: {
    userStateStore: null,
    rewardAddress: String,
    registerText: String,
    isAnonymousReg: Boolean
  },
  data() {
    return {
      registerForm: {
        email: "",
        password: "",
        name: "",
      },
      passwordRegex:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%-*#?&]{8,}$/,
    };
  },

  methods: {
    async doRegister() {
      this.userStateStore
        .registerCustomer(
          this.registerForm.email,
          this.registerForm.password,
          this.registerForm.name,
          this.isAnonymousReg
        )
        .then(async () => {
          if (this.userStateStore.loading_msg == "") {
            if (this.rewardAddress != "") {
              //join reward plan
              await this.userStateStore.joinReward(this.rewardAddress);
            }
            this.$router.push("/").then(() => {
              this.userStateStore.isLoading = false;
              this.$router.go(0);
            });
          }
        });
    },
  },
};
</script>

<style scoped></style>
