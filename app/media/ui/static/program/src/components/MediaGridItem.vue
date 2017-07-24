<template>
  <div v-if="!full" class="gallery-horizontal-box">
    <img :alt="media.title" :src="media.src" class="pure-img" />
  </div>
  <div v-else-if="full" class="pure-u-1-4 l-box">
    <img :alt="media.title" :src="media.src" class="pure-img" />
  </div>
</template>

<script>
export default {
    name: 'media-grid-item',
    props: ['media'],
    data() {
        return {
            full: false
        }
    }
}
</script>

<style scoped>
.l-box {
    padding: .25em;
    border: 1.5px solid gray;
    border-radius: 2px;
}
</style>
