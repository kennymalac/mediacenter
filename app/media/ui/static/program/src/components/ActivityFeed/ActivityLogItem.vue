<template>
    <div>
        {{ message }}
    </div>
</template>

<script>
export default {
    props: ['id', 'action', 'message', 'context', 'author'],
    computed: {
        detailsLink() {
            return `${this.id}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
