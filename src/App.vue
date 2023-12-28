<template>
  <main>
    <div class="container">
      <div v-if="!hasError" class="filter-wrapper">
        <DamageClassFilter @selected-damage-class="handleSelectedDamageClass"/>
      </div>

      <LoadingIndicator v-if="isLoading" />
      <MoveList v-else :moves="filteredMoves" @ref-changed="handleRefChanged"/>

      <ErrorNotification
        v-if="hasError"
        errorMessage="Oops! Something went wrong. Please try again later."
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { onMounted, ref } from 'vue'
import { Move, MoveClient } from 'pokenode-ts'
import { buildWebStorage } from 'axios-cache-interceptor'
import LoadingIndicator from './components/LoadingIndicator.vue'
import ErrorNotification from './components/ErrorNotification.vue'
import MoveList from './components/MoveList.vue'
import DamageClassFilter from './components/DamageClassFilter.vue'
import { DamageClass } from './types/DamageClassEnum'
import { useInfiniteScroll } from '@vueuse/core'

const moveApi = new MoveClient({
  cacheOptions: {
    storage: buildWebStorage(localStorage, 'axios-cache:')
  }
})
const movesData = ref([])
const moves = ref<Move[]>([])
const filteredMoves = ref<Move[]>([])
const scrollContainer = ref<HTMLElement | null>(null)
let isLoading = ref(false)
let hasError = ref(false)
let movesToShow = ref(10)

useInfiniteScroll(
  scrollContainer,
  async () => {
    await getMovesOnScroll()
  },
  { distance: 10 }
)

const handleRefChanged = (ref: HTMLElement | null) => {
  scrollContainer.value = ref
}

const getMovesOnScroll = async () => {
  if (movesToShow.value > 925) {
    return
  }

  const slicedMovesData = movesData.value.slice(moves.value.length, movesToShow.value + 1)
  
  const movesDetails = await Promise.all(
    slicedMovesData.map(async ({ url }) => (await axios.get(url)).data)
  )

  moves.value.push(...movesDetails)
  filteredMoves.value.push(...movesDetails)
  movesToShow.value += 10
}

const fetchMoves = async () => {
  try {
    isLoading.value = true
    const response = await moveApi.listMoves(undefined, 919)
    movesData.value = response.results
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const handleSelectedDamageClass = (selectedDamageClass: DamageClass) => {
  filterByDamageClass(moves.value, selectedDamageClass)
}

const filterByDamageClass = (data: Move[], damageClass = DamageClass.ALL) => {
  if (damageClass === DamageClass.ALL) {
    filteredMoves.value = data
  } else {
    filteredMoves.value = data.filter((move: Move) => move.damage_class.name === damageClass)
  }
}

onMounted(() => {
  fetchMoves()
})
</script>

<style lang="scss">
@import "./assets/styles/_reset";

html {
  font-family: system-ui, Lato, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  background-color: hsl(0, 0%, 98%);
  color: hsl(200, 19%, 18%);
  accent-color: hsl(1, 83%, 63%);
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  padding: 2rem;
}

.filter-wrapper {
  margin-bottom: 1rem;
}
</style>
