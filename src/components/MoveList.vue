<template>
    <ul class="moveList" role="list">
      <li
        v-for="move in moves"
        :key="move.id"
        class="moveList__item"
        role="listItem"
      >
        <div class="moveList__move-wrapper">
          <PokeMove :move="move" />
        </div>
        <BaseDivider aria-hidden="true" />
      </li>
    </ul>
</template>

<script setup lang="ts">
import { Move } from 'pokenode-ts';
import PokeMove from './PokeMove.vue';
import BaseDivider from './BaseDivider.vue';

defineProps<{
  moves: Move[]
}>()

</script>

<style lang="scss" scoped>
.moveList {
  width: 40rem;
  list-style: none;

  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__move-wrapper {
    padding: 0.5rem 0;
  }
}
</style>
