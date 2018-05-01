<template>
    <div class="action-button">
        <div class="icon-container">
            <img height="100%" width="100%" :src="image" />
        </div>
        <h2>{{name}}</h2>
    </div>
</template>

<script>
export default {
    props: ['id', 'image', 'name']
}
</script>

<style lang="scss">
</style>
