<template>
    <div class="group-list">
    <group-item v-for="group in items" :id="group.id" :name="group.name" :image="group.image" :link="link" />
    </div>
</template>

<script>
import GroupItem from './GroupItem'

export default {
    props: ['items', 'link'],
    components: {
        GroupItem
    }
}
</script>

<style lang="scss">
</style>
