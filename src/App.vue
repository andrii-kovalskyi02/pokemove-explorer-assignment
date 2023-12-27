<template>
  <main>
    <LoadingIndicator v-if="isLoading" />
    <PokeMove v-else-if="moves.length" :move="moves[0]" />

    <ErrorNotification
      v-if="hasError"
      errorMessage="Oops! Something went wrong. Please try again later."
    />
  </main>
</template>

<script setup lang="ts">
import axios from 'axios';
import { onMounted, ref } from 'vue'
import { Move, MoveClient } from 'pokenode-ts';
import { buildWebStorage } from 'axios-cache-interceptor';
import PokeMove from './components/PokeMove.vue'
import LoadingIndicator from './components/LoadingIndicator.vue'
import ErrorNotification from './components/ErrorNotification.vue'

const moveApi = new MoveClient({
  cacheOptions: {
    storage: buildWebStorage(localStorage, 'axios-cache:')
  }
})
const moves = ref<Move[]>([])
let isLoading = ref(false);
let hasError = ref(false);

const fetchData = async () => {
  try {
    isLoading.value = true
    const response = await moveApi.listMoves(undefined, 919)
    const movesData = response.results;

    const movesDetails = await Promise.all(
      movesData.map(async ({ url }) => (await axios.get(url)).data)
    )

    moves.value = movesDetails;
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="scss">
html {
  font-family: system-ui, Lato, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  background-color: hsl(0, 0%, 98%);
  color: hsl(200, 19%, 18%);
  accent-color: hsl(1, 83%, 63%);
}

body,
p {
  margin: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>
