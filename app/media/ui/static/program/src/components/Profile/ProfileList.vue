<template>
    <div class="profile-list">
        <profile-item v-for="profile in items" :id="profile.id" :name="profile.display_name" />
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
