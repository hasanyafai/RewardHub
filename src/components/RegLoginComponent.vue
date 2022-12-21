<template>
  <div class="form">
  <RouterLink to="" @click="anonymousLogin" class="lazy"
    > > Continue (for lazy customers ^_^) <br>
    this will create new anonymous account
  </RouterLink>
  <br>
    <br>
  <hr>
    <br>
  <div v-if="formActive == 'login'">
    <LoginComponent
      :userStateStore="userStateStore"
      :rewardAddress="''"
      :loginText="'Login'"
      :formActive="formActive"
      @registerCustomer="formActive = 'registerCustomer'"
    />
  </div>

  <div v-else-if="formActive == 'registerCustomer'">
    <RegisterComponent
      :userStateStore="userStateStore"
      :rewardAddress="''"
      :registerText="'Register'"
      :isAnonymousReg="false"
    />
    <RouterLink
      to=""
      @click="(formActive = 'login'), (userStateStore.loading_msg = '')"
    >
      I have account
    </RouterLink>
  </div>
  </div>
</template>

<script>
import LoginComponent from "@/components/LoginComponent.vue";
import RegisterComponent from "@/components/RegisterComponent.vue";

export default {
  components: {},
  props: {
    userStateStore: null,
    rewardAddress: String,
    loginText: String,
    registerText: String,
  },
  data() {
    return {
      formActive: "login",
      loginForm: {
        email: "",
        password: "",
      },
      registerForm: {
        email: "",
        password: "",
        name: "",
      },
      passwordRegex:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%-*#?&]{8,}$/,
    };
  },
  components: {
    LoginComponent,
    RegisterComponent,
  },
  methods: {
    async anonymousLogin() {
      this.userStateStore.anonymousLogin();
    },
    async doLogin() {
      await this.userStateStore
        .signin(this.loginForm.email, this.loginForm.password)
        .then(async (res) => {
          if (this.userStateStore.loading_msg == "") {
            if (this.rewardAddress != "") {
              //join reward plan
              await this.userStateStore.joinReward(this.rewardAddress);
            }
            this.$router.push("/").then(() => {
              this.$router.go(0);
              this.userStateStore.isLoading = false;
            });
          }
        });
    },
    async doRegister() {
      this.userStateStore
        .registerCustomer(
          this.registerForm.email,
          this.registerForm.password,
          this.registerForm.name
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
    doResetPS() {
      this.userStateStore.resetPassword(this.emailResetPS);
    },
  },
};
</script>

<style scoped></style>
