<template>
  <div class="move">
    <p class="move__title">{{ capitalizeFirstLetter(move.name) }}</p>
    <div class="move__icon-container">
      <img
        :src="iconType"
        :alt="`${capitalizeFirstLetter(move.type.name)} Type Icon`" class="move__icon"
      />
      <img
        :src="damageClassIcon"
        :alt="
          `${capitalizeFirstLetter(move.damage_class.name)} Damage Class Icon`"
        class="move__icon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';
import { Move } from 'pokenode-ts';

const props = defineProps<{
  move: Move
}>()

const iconType = computed(() => `src/assets/images/icons/type/${capitalizeFirstLetter(props.move.type.name)}IC_SV.png`)

const damageClassIcon = computed(() => `src/assets/images/icons/damage-class/${capitalizeFirstLetter(props.move.damage_class.name)}_icon_HOME.png`)
</script>

<style scoped lang="scss">
.move {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 40rem;

  &__title {
    font-size: 1.5rem;
  }

  &__icon {
    height: 2rem;

    &-container {
      display: flex;
      gap: 1rem;
    }
  }
}
</style>
