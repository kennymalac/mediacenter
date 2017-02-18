<template>
    <div class="pure-menu pure-menu-horizontal">
        <router-link to="/" class="pure-menu-heading pure-menu-link">MEDIA SERVER</router-link>
        <ul class="pure-menu-list">
            <li class="pure-menu-item">
                <router-link to="/feed" class="pure-menu-link">Feed</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/chat" class="pure-menu-link">Chat</router-link>
            </li>
            <li class="pure-menu-item">
                <router-link to="/gallery" class="pure-menu-link">Media Gallery</router-link>
            </li>
        </ul>
        <!-- {% block userlogin %} -->
        <form class="pure-form">
            <fieldset>
                <input type="text" placeholder="username">
                <input type="password" placeholder="password">

                <label for="remember">
                    <input id="remember" type="checkbox"> Remember Me
                </label>

                <button type="submit" class="pure-button pure-button-primary">Sign in</button>
            </fieldset>

            <!-- {% csrf_token %} -->
        </form>
    </div>
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

