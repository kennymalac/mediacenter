<template>
    <div class="pure-menu pure-menu-horizontal">
        <router-link to="/" class="pure-menu-heading pure-menu-link">MEDIA SERVER</router-link>
        <ul class="pure-menu-list">
            <li class="pure-menu-item">
                <router-link to="/register" class="pure-menu-link">Register</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/feed" class="pure-menu-link">Feed</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/chat" class="pure-menu-link">Chat</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/gallery" class="pure-menu-link">Media Gallery</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/album/list" class="pure-menu-link">Manage Albums</router-link>
            </li>
        </ul>

        <login :embed="true"/>
    </div>
</template>

<script>
import Login from "./Login"
export default {
    name: 'header-menu',
    components: {
        Login
    },
    data() {
        return {

        }
    }
}
</script>

