<template>
    <router-link class="action-button" :to="groupLink">
        <div class="icon-container">
            <img height="100%" width="100%" :src="image" />
        </div>
        <h2>{{name}}</h2>
    </router-link>
</template>

<script>
export default {
    props: ['id', 'image', 'name'],
    computed: {
        groupLink() {
            return `${this.id}/details`
        }
    }
}
</script>

<style lang="scss">
</style>
