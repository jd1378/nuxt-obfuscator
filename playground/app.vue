<template>
  <div class="flex justify-center items-center my-content">
    Nuxt module playground!
    <div :class="dClass ? 'fooClass' : 'barClass'">what</div>
  </div>
</template>

<script setup>
const dClass = ref(false);
</script>

<style lang="css">
html,
body,
#__nuxt {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#__nuxt {
  background-color: black;
  color: wheat;
}

.flex {
  display: flex;
}

.justify-center {
  justify-content: center;
}

.items-center {
  align-items: center;
}

.my-content {
  width: 100%;
  height: 100%;
}

.fooClass {
  color: orange;
}

.barClass {
  color: yellow;
}
</style>
