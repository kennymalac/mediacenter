<template>
    <nav>
        <router-link class="brand" to="/">
            <label>MEDIA SERVER</label>
        </router-link>
        <!-- responsive-->
        <input id="bmenub" type="checkbox" class="show">
        <label for="bmenub" class="burger pseudo button">menu</label>
        
        <div class="menu">
            <router-link class="button pseudo" to="/login">Login</router-link>
            <router-link class="button pseudo" to="/register">Register</router-link>
            <router-link class="button pseudo" to="/feed/list">Feeds</router-link>
            <router-link class="button pseudo" to="/group/list">Groups</router-link>
            <router-link class="button pseudo" to="/chat">Chat</router-link>
            <router-link class="button pseudo" to="/gallery">Media Gallery</router-link>
            <router-link class="button pseudo" to="/album/create">Create Album</router-link>
            <router-link class="button pseudo" to="/album/list">Manage Albums</router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'header-menu',
    data() {
        return {

        }
    }
}
</script>

