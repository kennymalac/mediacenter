<template>
    <action-button size="large" :image="image" :link="feedLink" :icon="icon" :title="name" />
</template>

<script>
import ActionButton from './ActionButton'

export default {
    props: ['id', 'icon', 'image', 'name'],
    components: {
        ActionButton
    },
    computed: {
        feedLink() {
            return `${this.id}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
