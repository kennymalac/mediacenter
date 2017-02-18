<template>
  <div v-if="!full" class="gallery-horizontal-box">

  </div>
  <div v-if="full" class="pure-u-1-4 l-box">
    <img alt="{{media.url}}" src="{{media.src}}" class="pure-img" />
  </div>
</template>

<script>
export default {
    name: 'media-grid-item',
    data: () => {
        return {
            full: false
        }
    }
}
</script>

<style scoped>
.gallery-horizontal-box {
    display: inline-block;
    margin-right: .5rem;
    border-radius: 4px / 5px;
    border: 2px solid rgba(52, 73, 94,1.0);
    background-color: rgba(221, 221, 221, 1);
    height: 6rem;
    width: 8rem;
}
.l-box {
    padding: .25em;
    border: 1.5px solid gray;
    border-radius: 2px;
}
</style>
