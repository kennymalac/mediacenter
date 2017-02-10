<template>
  <div v-if="!full" class="gallery-horizontal-box">

  </div>
  <div v-if="full" class="pure-u-1-4 l-box">
    <img alt="{{media-datum.url}}" src="{{media-datum.src}}" class="pure-img" />
  </div>
</template>

<script>
var mediaItem = {
    data: => () {

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
