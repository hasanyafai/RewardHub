
<template>
  <div class="form">
    <h1>Create Reward Plan</h1>
    <VeeForm @submit="doRegister">
      <AppSpinner v-if="userState.isLoading" />
      <p v-else class="input-err-msg">
        {{ userState.loading_msg }}
      </p>

      <div class="rh-rewardAddress-div">
        <span>rhubapp.com/reward/ </span>
      <VeeField
        class="rh-field-rewardAddress"
        v-model="rewardAddress"
        name="Reward Address"
        type="name"
        maxlength="12"
        placeholder="reward address"
        :rules="{ required: true, rewardAddress, regex: bNRegex }"
      />
      <div class="message">
        <VeeErrorMessage name="Reward Address" />
      </div>
      </div>

      <label for="Business Name">Business Name</label>
      <VeeField
        class="rh-input"
        v-model="businessName"
        name="Business Name"
        type="name"
        placeholder="your business name"
        :rules="{ required: true, businessName, regex: bNRegex }"
      />
      <div class="message">
        <VeeErrorMessage name="Business Name" />
      </div>

      <label for="Registration Email">Business Email</label>
      <VeeField
        class="rh-input"
        v-model="emailReg"
        name="Registration Email"
        type="email"
        placeholder="Email"
        rules="required|email"
      />
      <div class="message">
        <VeeErrorMessage name="Registration Email" />
      </div>

      <label for="Registration Password">Password</label>
      <VeeField
        class="rh-input"
        v-model="passwordReg"
        name="Registration Password"
        type="password"
        placeholder="Password"
        :rules="{ required: true, regex: passwordRegex }"
      />
      <div class="message">
        <VeeErrorMessage name="Registration Password" />
      </div>
      <div class="rh-list-normal">
        <p>Password should have:</p>
        <li>8 characters</li>
        <li>one letter</li>
        <li>one number</li>
        <li>one special character</li>
      </div>

      <div v-if="!userState.isLoading">
        <button type="submit" class="rh-big-btn">Create Reward Plan</button>
      </div>
    </VeeForm>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    userState: null,
  },
  data() {
    return {
      businessLogin: false,
      formActive: "login",
      rewardAddress: "",
      businessName: "",
      emailReg: "",
      passwordReg: "",
      passwordRegex:
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%-*#?&]{8,}$/,
      bNRegex: /[a-zA-Z0-9_]{1,}$/,
    };
  },

  methods: {
    async doRegister() {
      this.userState
        .registerBusiness(this.emailReg, this.passwordReg, this.businessName,
        this.rewardAddress)
        .then(() => {
          // if (this.userState.loading_msg == "") {
          //   this.$router.push("/").then(() => {
          //     this.userState.isLoading = false;
          //     this.$router.go(0);
          //   });
          // }
        });
    },
  },
};
</script>

<style scoped></style>
