<template>
  <div
    :class="[
      errorState ? 'bg-red-300' : 'bg-green-300',
      responseMessage !== '' ? 'transformLeft' : 'fadeInOut',
    ]"
    id="responseCard"
    class="
      responseCard
      py-3
      w-96
      text-left
      rounded-tl-3xl rounded-bl-3xl
      px-4
      absolute
      font-semibold
      z-10
    "
    ref="resCard"
  >
    {{ responseMessage }}
  </div>
</template>

<script>
export default {
  props: {
    errorState: Boolean,
    responseMessage: String,
  },
};
</script>

<style scoped>
.fadeInOut {
  -webkit-animation: fadeinout 4s linear forwards;
  animation: fadeinout 4s linear forwards;
}

@-webkit-keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

@keyframes fadeinout {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.transformLeft {
  animation: slide-in 0.5s forwards;
  -webkit-animation: slide-in 0.5s forwards;
}

@keyframes slide-in {
  0% {
    -webkit-transform: translateX(100%);
  }
  100% {
    -webkit-transform: translateX(0%);
  }
}
@-webkit-keyframes slide-in {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0%);
  }
}

.transformRight {
  animation: slide-out 0.5s forwards;
  -webkit-animation: slide-out 0.5s forwards;
}

@keyframes slide-out {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}
@-webkit-keyframes slide-out {
  0% {
    -webkit-transform: translateX(0%);
  }
  100% {
    -webkit-transform: translateX(100%);
  }
}
</style>
