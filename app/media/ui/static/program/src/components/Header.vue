<template>
    <nav>
        <router-link class="brand" to="/">
            <label>FLATLANDERS</label>
        </router-link>
        <!-- responsive-->
        <input id="bmenub" type="checkbox" class="show">
        <label for="bmenub" class="burger pseudo button">menu</label>

        <div v-if="!loggedIn" class="menu">
            <router-link v-if="!loggedIn" :class="menuClass" to="/login">Login</router-link>
            <router-link v-if="!loggedIn" :class="menuClass" to="/register">Register</router-link>
        </div>

        <div v-else class="menu">
            <router-link :class="menuClass" to="/place/"><i class="icon ion-ios-compass"></i> Places</router-link>
            <router-link :class="menuClass" to="/feed/"><i class="ion-ios-list-box"></i> Feeds</router-link>
            <router-link :class="menuClass" to="/group/"><i class="ion-ios-people"></i> Groups</router-link>
            <router-link :class="menuClass" to="/profile/"><i class="ion-md-people"></i> Users</router-link>
            <!-- <router-link :class="menuClass" to="/chat"><i class="ion-ios-chatbubbles"></i> Chat</router-link> -->
            <router-link :class="menuClass" to="/gallery/"><i class="ion-ios-image"></i> Gallery</router-link>
            <router-link :class="menuClass" to="/album/"><i class="ion-ios-albums"></i> Albums</router-link>

            <notification-popover />
            <active-user />
            <label for="modal_1" style="border-radius: 50%; line-height: 1.5rem;" class="button"><i style="font-size: 1.5rem;" class="ion ion-ios-help"></i></label>
        </div>
    </nav>
</template>

<script>
import ActiveUser from './ActiveUser'
import NotificationPopover from './Notification/NotificationPopover'

export default {
    name: 'header-menu',
    components: {ActiveUser, NotificationPopover},
    props: {
        loggedIn: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
        }
    },
    computed: {
        menuClass(item) {
            return {
                button: true,
                pseudo: true,
                'nav-item': true
            }
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";
nav {
    box-shadow: 0px 1px 2px -1px rgba(0, 0, 0, 0.4);
}

div.menu .nav-item {
    border-radius: 0;
    transition: $picnic-transition;
    box-shadow: none;

    &.router-link-active, &:hover, &:focus {
        color: #49637e;
        box-shadow: 0 0.2rem 0 #49637e;
    }
}
</style>
