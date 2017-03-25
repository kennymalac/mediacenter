<template>
    <div v-if="embed" class="">
        <div v-bind:class="info">
            {{ infoBox.message }}
        </div>

        <form v-if="!loggedIn" v-on:submit.prevent="login" class="pure-form">
            <fieldset>
                <input v-model="user.username" type="text" placeholder="username">
                <input v-model="user.password" type="password" placeholder="password">

                <label for="remember">
                    <input id="remember" type="checkbox"> Remember Me
                </label>

                <input type="submit" text="Sign in" class="pure-button pure-button-primary"/>
            </fieldset>

            <!-- {% csrf_token %} -->
        </form>

        <div v-if="loggedIn">
            Welcome {{user.username}}!
        </div>
    </div>
</template>

<script>
import auth from "../auth.js"
import router from '../router/index.js'

export default {
    props: ["embed"],
    data() {
        return {
            embed: false,
            loggedIn: false,
            infoBox: {
                status: "",
                message: ""
            },
            user: {
                username: "",
                password: ""
            }
        }
    },
    computed: {
        info() {
            //return Your account was logged in successfully
            //return error, info
            return {
                hidden: (this.infoBox.message.length < 1),
                error: (this.infoBox.status === "error"),
                info: (this.infoBox.status === "info"),
                success: (this.infoBox.status === "success")
            }
        }
    },
    methods: {
        login() {
            // TODO JWT token auth

            let that = this
            auth.login(this.user.username, this.user.password, (error) => {
                that.infoBox.status = "error"
                that.infoBox.message = 'The account could not be created for the following reason: ' + error
            }).then(() => {
                that.infoBox.status = "success"
                that.infoBox.message = "Your account was logged in successfully"
                this.loggedIn = true
                router.replace('/')
            })
        }
    }
}
</script>
