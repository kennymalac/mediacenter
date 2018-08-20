<template>
    <div class="profile-list">
        <profile-item v-for="profile in items" :image="profile.picture" :id="profile.id" :name="profile.display_name" />
    </div>
</template>

<script>
import ProfileItem from './ProfileItem'

export default {
    props: ['items'],
    components: {
        ProfileItem
    }
}
</script>

<style lang="scss">
.profile-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}
</style>
