<template>
    <action-button size="large" :link="feedLink" :icon="icon" :title="name" />
</template>

<script>
import ActionButton from './ActionButton'

export default {
    props: ['id', 'icon', 'name'],
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
