<template>
  <header>
    <div class="wrapper">
      <h1>RewardHub</h1>
    </div>
  </header>
  <div class="wrapper">
    <div class="rh-div-text">
      "An easy way to say "Thank You !" and Reward our everyday customers"
    </div>
    <RegLoginComponent
      :userStateStore="userStateStore"
      :rewardAddress="''"
      :loginText="'Login'"
      :registerText="'Register'"
    />
    <br />
    <br />
    <button class="rh-button" @click="showModal = true">
      Create Reward Plan for Business
    </button>
    <vue-final-modal
      v-model="showModal"
      classes="modal-container"
      content-class="modal-content"
    >
      <div class="modal__content">
        <div class="greetings">
          <BusinessRegComponent :userState="userStateStore" />
          <div class="modal__close">
            <button class="rh-btn-normal" @click="showModal = false">
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </vue-final-modal>
  </div>
</template>

<script>
import BusinessRegComponent from "@/components/BusinessRegComponent.vue";
import RegLoginComponent from "@/components/RegLoginComponent.vue";
import { useUserStateStore } from "@/stores/userState";

export default {
  components: {
    BusinessRegComponent,
    RegLoginComponent,
  },
  created() {},
  data: () => ({
    userStateStore: useUserStateStore(),
    showModal: false,
  }),
  methods: {},
};
</script>

<style scoped>
.head-button {
  padding: 0.5rem;
  font-size: large;
  font-weight: bold;
  background-color: var(--color-text);
  color: var(--color-background);
}
::v-deep .modal-container {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .modal-content {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--color-background);
  width: 100%;
  height: 100%;
}
.modal__title {
  margin: 0 2rem 0 0;
  font-size: 1.5rem;
  font-weight: 700;
}
.modal__close {
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.head-button:hover {
  background-color: hsla(160, 100%, 37%, 1);
}
.dark-mode div::v-deep .modal-content {
  border-color: #2d3748;
  background-color: #1a202c;
}
</style>
