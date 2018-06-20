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
            <router-link v-if="!loggedIn" class="button pseudo" to="/register">Register</router-link>
            <router-link class="button pseudo" to="/feed/list"><i class="ion-ios-list-box"></i> Feeds</router-link>
            <router-link class="button pseudo" to="/group/list"><i class="ion-ios-people"></i> Groups</router-link>
            <router-link class="button pseudo" to="/profile/list"><i class="ion-md-people"></i> Users</router-link>
            <!-- <router-link class="button pseudo" to="/chat"><i class="ion-ios-chatbubbles"></i> Chat</router-link> -->
            <router-link class="button pseudo" to="/gallery"><i class="ion-ios-image"></i> Media Gallery</router-link>
            <router-link class="button pseudo" to="/album/list"><i class="ion-ios-albums"></i> Albums</router-link>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'header-menu',
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    }
}
</script>
