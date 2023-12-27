<template>
  <div class="damageFilter">
    <h4 id="damageClassHeading">Damage Class:</h4>
    <div role="radiogroup" aria-labelledby="damageClassHeading" class="damageFilter__options">
      <template v-for="damageClass in damageClassFilterValues" :key="damageClass">
        <input
          type="radio"
          :id="damageClass"
          name="damageClass"
          class="damageFilter__options-input"
          :value="damageClass"
          v-model="selectedDamageClass"
          @change="emitSelectedDamageClass"
          :checked="damageClass === DamageClass.ALL"
          :aria-checked="damageClass === selectedDamageClass"
          :aria-label="capitalizeFirstLetter(damageClass)"
        />
        <label :for="damageClass" class="damageFilter__options-label">
          {{ capitalizeFirstLetter(damageClass) }}
        </label>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { DamageClass } from '../types/DamageClassEnum';
import { capitalizeFirstLetter } from '../utils/capitalizeFirstLetter';

const emit = defineEmits(['selected-damage-class'])

const selectedDamageClass = ref(DamageClass.ALL)
const damageClassFilterValues: string[] = Object.values(DamageClass);


const emitSelectedDamageClass = () => {
  emit('selected-damage-class', selectedDamageClass.value);
}
</script>

<style lang="scss" scoped>
.damageFilter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__options {
    &-input {
      margin-right: 0.25rem;
      cursor: pointer;
    }

    &-label {
      margin-right: 1rem;
      cursor: pointer;
    }
  }
}
</style>
