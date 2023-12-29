<template>
  <button
    :class="`button button--${customClass}`"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
defineProps<{
  customClass: string
}>()
</script>

<style lang="scss" scoped>
.button {
  @include flexCenter;

  background-color: $white;
  cursor: pointer;

  &--load-more {
    padding: 0.5rem;
    width: 15rem;
    height: 2.5rem;

    border: 1px solid $light-grey;
    border-radius: 2.5rem;

    font-size: 1.5rem;
    font-family: inherit;

    @include hover(border-color, $black);
  }
}
</style>
