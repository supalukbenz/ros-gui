<template>
  <div class="bg-loading flex flex-col justify-center items-center z-20">
    <div class="spinner-border text-white" style="width: 5rem; height: 5rem" role="status"></div>
    <div class="font-bold text-white text-2xl mt-2">Connecting...</div>
  </div>
</template>

<style scoped>
.bg-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 16, 16, 0.5);
}
</style>
