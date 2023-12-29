<template>
    <TransitionGroup name="list" tag="ul" class="moveList" role="list">
      <li
        v-for="(move, index) in moves"
        :key="move.id"
        class="moveList__item"
        role="listItem"
      >
        <div class="moveList__move-wrapper">
          <PokeMove :move="move" />
        </div>
        <BaseDivider v-if="index !== moves.length - 1" aria-hidden="true" />
      </li>
    </TransitionGroup>
</template>

<script setup lang="ts">
import { Move } from 'pokenode-ts'
import PokeMove from './PokeMove.vue'
import BaseDivider from './BaseDivider.vue'

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

.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
