<script setup>
import { useUserStateStore } from "@/stores/userState";
const userStateStore = useUserStateStore();
</script>

<template>
<AppSpinner v-if="userStateStore.isNavLoading" />
  <RouterView v-else />
</template>

<script>
export default {
};
</script>

