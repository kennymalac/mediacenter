<template>
    <action-button :link="groupLink" :image="image" :title="name" />
</template>

<script>
import ActionButton from '../ActionButton'

export default {
    props: ['id', 'stashId', 'image', 'name'],
    components: {
        ActionButton
    },
    computed: {
        groupLink() {
            return `${this.id}/details/stash/${this.stashId}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
