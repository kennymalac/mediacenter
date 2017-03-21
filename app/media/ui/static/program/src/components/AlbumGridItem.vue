<template>
    <div class="album gallery-horizontal-box">
        <img v-if="album.thumbnail" :src="album.thumbnail.src" :alt="album.thumbnail.alt" class="pure-img"/>
        <label v-if="album.title && album.owner">
            {{album.title}} by {{album.owner.first_name}} {{album.owner.last_name}}
        </label>
        <div>
            <button v-on:click="selectAlbum()" class="btn">Show</button>
        </div>
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
    },
    methods: {
        selectAlbum(album) {
            this.$emit('albumSelected', this.album)
        }
    }
}
</script>

<style scoped lang="scss">

</style>
