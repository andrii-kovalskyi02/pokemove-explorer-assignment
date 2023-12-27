<template>
  <div class="loading">
    <span>•</span>
    <span>•</span>
    <span>•</span>
  </div>
</template>

<style lang="scss" scoped>
.loading {
  display: block;
  text-align: center;
}

.loading span {
  font-size: 1.5rem;
  letter-spacing: 0.25rem;
  line-height: 1.5rem;

  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
}

.loading span:nth-child(2) {
  animation-delay: 0.2s;
}

.loading span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {
  0% {
    opacity: 0.2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
