<template>
    <action-button :link="placeLink" icon="ion-ios-home" :title="name" />
</template>

<script>
import ActionButton from '../ActionButton'

export default {
    props: ['id', 'image', 'name'],
    components: {
        ActionButton
    },
    computed: {
        placeLink() {
            return `${this.id}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
