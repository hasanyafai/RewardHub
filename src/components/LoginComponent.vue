<template>
  <div v-if="formActive == 'login'">
    <h2>Login</h2>
    <br>
    <VeeForm @submit="doLogin">
      <label for="Login Email">Login Email</label>
      <VeeField
        class="rh-input"
        v-model="loginForm.email"
        type="email"
        name="Login Email"
        placeholder="Email"
        rules="required|email"
      />
      <div class="message">
        <VeeErrorMessage name="Login Email" />
      </div>
      <label for="Login Password">Login Password</label>
      <VeeField
        class="rh-input"
        v-model="loginForm.password"
        type="password"
        name="Login Password"
        placeholder="Password"
        :rules="{ required: true, regex: passwordRegex }"
      />
      <div class="message">
        <VeeErrorMessage name="Login Password" />
      </div>
      <AppSpinner v-if="userStateStore.isLoading" />
      <p class="input-err-msg" v-else>{{ userStateStore.loading_msg }}</p>
      <button type="submit" class="rh-btn-normal">{{loginText}}</button>
      <br>
      <RouterLink
        to=""
        @click="(formActive = 'forgetPS'), (userStateStore.loading_msg = '')"
      >
        Forget Password ?
      </RouterLink>
      <br />
      <RouterLink
        to=""
        @click="
          (this.$emit('registerCustomer')), (userStateStore.loading_msg = '')
        "
      >
        Create new customer account
      </RouterLink>
    </VeeForm>
  </div>

  <div v-else-if="formActive == 'forgetPS'">
    <h2>Forget Password</h2>
    <VeeForm @submit="doResetPS">
      <label for="Account Email">Account Email</label>
      <VeeField
        class="rh-input"
        v-model="emailResetPS"
        type="email"
        name="Account Email"
        placeholder="Email"
        rules="required|email"
      />
      <div class="message">
        <VeeErrorMessage name="Account Email" />
      </div>

      <AppSpinner v-if="userStateStore.isLoading" />
      <p class="input-err-msg" v-else>{{ userStateStore.loading_msg }}</p>
      <button type="submit" class="rh-btn-normal">
        Request Password Reset
      </button>
      <RouterLink
        to=""
        @click="(formActive = 'login'), (userStateStore.loading_msg = '')"
      >
        Cancel
      </RouterLink>
    </VeeForm>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    userStateStore: null,
    rewardAddress: String,
    loginText: String,
    formActive: String
  },
  data() {
    return {
      loginForm: {
        email: "",
        password: "",
      },
      passwordRegex:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%-*#?&]{8,}$/,
    };
  },

  methods: {
    async doLogin() {
      await this.userStateStore
        .signin(this.loginForm.email, this.loginForm.password)
        .then(async (res) => {
          if (this.userStateStore.loading_msg == "") {
            if(this.rewardAddress != ''){
              //join reward plan
              await this.userStateStore.joinReward(this.rewardAddress)
            }
            this.$router.push("/").then(() => {
              this.$router.go(0);
              this.userStateStore.isLoading = false;
            });
          }
        });
    },
    doResetPS() {
      this.userStateStore.resetPassword(this.emailResetPS);
    },
  },
};
</script>

<style scoped></style>
