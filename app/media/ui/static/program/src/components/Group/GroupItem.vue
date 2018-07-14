<template>
    <action-button :link="groupLink" :image="image" :title="name" />
</template>

<script>
import ActionButton from '../ActionButton'

export default {
    props: ['id', 'image', 'name', 'link'],
    components: {
        ActionButton
    },
    computed: {
        groupLink() {
            return this.link ? this.link(this.id) : `${this.id}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
