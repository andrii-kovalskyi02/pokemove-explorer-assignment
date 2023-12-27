<template>
  <div class="error">
    <p>{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  errorMessage: string
}>();

</script>

<style lang="scss" scoped>
.error {
  width: 40%;
  margin: 0.625rem auto;
  padding: 0.625rem;
  border: 1px solid #ff0000;
  color: #ff0000;
  text-align: center;
}
</style>
