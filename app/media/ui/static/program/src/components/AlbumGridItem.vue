<template>
    <div class="album gallery-horizontal-box">
        <img v-if="album.thumbnail" :src="album.thumbnail.src" :alt="album.thumbnail.alt" class="pure-img"/>
        <label v-if="album.title && album.owner">
            {{album.title}} by {{album.owner.first_name}} {{album.owner.last_name}}
        </label>
    </div>
</template>

<script>
// thumbnail: {
// alt: 'An image',
// src: ''
// },
export default {
    props: ['album'],
    data() {
        return {
        }
    }
}
</script>

<style scoped lang="scss">

</style>
