<template>
    <div class="album gallery-horizontal-box">
        <img :src="thumbnail.src" :alt="thumbnail.alt" class="pure-img"/>
        <label>
            {{title}} by {{owner}}
        </label>
    </div>
</template>

<script>
export default {
    data() {
        return {
            title: '',
            thumbnail: {
                alt: 'An image',
                src: ''
            },
            owner: '',
            tags: []
        }
    }
}
</script>

<style scoped lang="scss">

</style>
