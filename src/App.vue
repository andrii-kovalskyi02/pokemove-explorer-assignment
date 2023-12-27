<template>
  <main>
    <div class="container">
      <div v-if="!hasError" class="filter-wrapper">
        <DamageClassFilter @selected-damage-class="handleSelectedDamageClass"/>
      </div>

      <LoadingIndicator v-if="isLoading" />
      <MoveList v-else-if="filteredMoves.length" :moves="filteredMoves" />

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
import { DamageClass } from './utils/DamageClass';

const moveApi = new MoveClient({
  cacheOptions: {
    storage: buildWebStorage(localStorage, 'axios-cache:')
  }
})
const moves = ref<Move[]>([])
const filteredMoves = ref<Move[]>([])
let isLoading = ref(false)
let hasError = ref(false)

const fetchMoves = async () => {
  try {
    isLoading.value = true
    const response = await moveApi.listMoves(undefined, 919)
    const movesData = response.results;

    const movesDetails = await Promise.all(
      movesData.map(async ({ url }) => (await axios.get(url)).data)
    )

    filteredMoves.value = movesDetails
    moves.value = movesDetails;
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

function filterByDamageClass(data: Move[], damageClass = DamageClass.ALL) {
  if (damageClass === DamageClass.ALL) {
    filteredMoves.value = data
  } else {
    filteredMoves.value = data.filter((move: Move) => move.damage_class.name === damageClass)
  }
}

const handleSelectedDamageClass = (selectedDamageClass: string) => {
  filterByDamageClass(moves.value, selectedDamageClass)
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
