<template>
    <div id="program">
        <header>
            <header-menu :loggedIn="loggedIn" />
            <!-- <auth-menu></auth-menu> -->
        </header>
        <intro-modal />
        <transition name="view-fade" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>

<script>
import Header from './components/Header.vue'
//import Pager from './pager.js'
//import 'pure-css'
import {activeUser} from './store.js'
import IntroModal from './components/IntroModal'

export default {
    name: 'program',
    components: {
        'header-menu': Header,
        IntroModal
    },
    async mounted() {
        // this.$store.$observe('activeUser', (activeUser) => {
        //     console.log('huzzah', activeUser)

        // })
        const user = await activeUser()
        this.user = user
    },
    data() {
        return {
            user: {}
        }
    },
    computed: {
        loggedIn() {
            return this.user.details && this.user.details.id !== 0
        }
    }
}
</script>

<style lang="scss">
$ionicons-font-path: "~ionicons/dist/fonts";
@import "~ionicons/dist/scss/ionicons.scss";
@import "~picnic/picnic.css";
@import "~ladda/css/ladda.scss";
@import "classicTheme.scss";
@import '~pretty-checkbox/src/pretty-checkbox.scss';

.grid { display: grid }

.view-fade-enter-active, .view-fade-leave-active {
    transition: opacity .15s ease;
}
.view-fade-enter, .view-fade-leave-to {
    opacity: 0;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
