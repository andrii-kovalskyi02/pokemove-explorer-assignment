<template>
  <main>
    <div class="container">
      <template v-if="!hasError">
        <div class="wrapper">
          <div class="filter-wrapper">
            <DamageClassFilter @selected-damage-class="handleSelectedDamageClass"/>
          </div>

          <MoveList v-if="filteredMoves.length" :moves="filteredMoves" />
        </div>

        <LoadingIndicator v-if="isLoading" />
        <CustomButton v-else-if="shouldShowButton" customClass="load-more" @click="fetchMoves">
          Load More Moves
        </CustomButton>
      </template>

      <ErrorNotification
        v-else
        errorMessage="Oops! Something went wrong. Please try again later."
      />
    </div>
  </main>
</template>

<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { Move, MoveClient } from 'pokenode-ts'
import { buildWebStorage } from 'axios-cache-interceptor'
import LoadingIndicator from './components/LoadingIndicator.vue'
import ErrorNotification from './components/ErrorNotification.vue'
import CustomButton from './components/CustomButton.vue'
import MoveList from './components/MoveList.vue'
import DamageClassFilter from './components/DamageClassFilter.vue'
import { DamageClass } from './types/DamageClassEnum'

const moveApi = new MoveClient({
  cacheOptions: {
    storage: buildWebStorage(localStorage, 'axios-cache:')
  }
})
const moves = ref<Move[]>([])
const filteredMoves = ref<Move[]>([])
const selectedDamageClass = ref(DamageClass.ALL)
const isLoading = ref(false)
const hasError = ref(false)
const movesDataLimit = ref(919)
const firstMoveIndexToGet = ref(0)
const limitOfMovesPerRequest = ref(20)

const shouldShowButton = computed(() => moves.value.length <= movesDataLimit.value)

const fetchMoves = async () => {
  try {
    isLoading.value = true
    const response = await moveApi.listMoves(
      firstMoveIndexToGet.value,
      limitOfMovesPerRequest.value
    )
    const movesData = response.results

    const movesDetails = await Promise.all(
      movesData.map(async ({ url }) => (await axios.get(url)).data)
    )
    
    firstMoveIndexToGet.value += limitOfMovesPerRequest.value

    moves.value.push(...movesDetails)
    filterByDamageClass(movesDetails, selectedDamageClass.value, true)
  } catch {
    hasError.value = true
  } finally {
    isLoading.value = false
  }
}

const filterByDamageClass = (
  data: Move[],
  damageClass = DamageClass.ALL,
  shouldModifyPart: boolean = false
) => {
  if (damageClass === DamageClass.ALL) {
    filteredMoves.value = [...moves.value]
  } else {
    const filtered = data.filter((move: Move) => move.damage_class.name === damageClass)

    shouldModifyPart
      ? filteredMoves.value.push(...filtered)
      : filteredMoves.value = filtered
  }
}

const handleSelectedDamageClass = (damageClass: DamageClass) => {
  selectedDamageClass.value = damageClass
  filterByDamageClass(moves.value, damageClass)
}

onMounted(() => {
  fetchMoves()
})
</script>

<style lang="scss">
@import "./assets/styles/_reset";

html {
  font-family: $font-default;
  font-size: 16px;
  line-height: 1.5;
  background-color: $main-background-color;
  color: $font-color;
  accent-color: $accent-color;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  padding: 2rem;
}

.filter-wrapper {
  margin-bottom: 1rem;
}
</style>
