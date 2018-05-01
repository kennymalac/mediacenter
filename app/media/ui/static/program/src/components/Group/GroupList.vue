<template>
    <div class="group-list">
        <group-item v-for="group in items" :name="group.name" :image="group.image" />
    </div>
</template>

<script>
import GroupItem from './GroupItem'

export default {
    props: ['items'],
    components: {
        GroupItem
    }
}
</script>

<style lang="scss">
</style>
