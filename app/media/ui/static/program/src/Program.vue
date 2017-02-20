<template>
    <div id="program">
        <header>
            <header-menu/>
            <!-- <auth-menu></auth-menu> -->
        </header>

        <div class="pure-g">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import Header from './components/Header.vue'
import 'pure-css'

export default {
    name: 'program',
    components: {
        'header-menu': Header
    }
}
</script>

<style lang="scss">
$ionicons-font-path: "~ionicons/dist/fonts";
@import "~ionicons/dist/scss/ionicons.scss";

#program {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
