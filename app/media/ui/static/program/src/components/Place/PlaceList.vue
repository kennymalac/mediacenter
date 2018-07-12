<template>
    <div class="place-list">
       <place-item v-for="place in items" :id="place.id" :name="place.name" />
    </div>
</template>

<script>
import PlaceItem from './PlaceItem'

export default {
    props: ['items'],
    components: {
        PlaceItem
    }
}
</script>

<style lang="scss">
</style>
