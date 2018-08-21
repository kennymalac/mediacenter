<template>
    <div>
        <div :class="info">
            {{ infoBox.message }}
        </div>

        <Modal :isOpen="isModalOpen" :onClose="closeModal" justifyContent="center" :titleProps="{ title: 'Login' }">

            <form id="login-form" v-if="!loggedIn()" @submit.prevent="login">
                <fieldset>
                    <input v-model="user.username" class="stack" type="text" placeholder="username" />
                    <input v-model="user.password" class="stack" type="password" placeholder="password" />

                    <label for="remember" class="stack">
                        <input id="remember" type="checkbox">
                        <span class="checkable">Remember me</span>
                    </label>

                    <input type="submit" class="stack" value="Sign in" />
                </fieldset>
                <!-- {% csrf_token %} -->
            </form>

            <div v-if="loggedIn()">
              Welcome {{user.username}}!
              <button @click="logout">Logout</button>
            </div>
        </Modal>
    </div>
</template>

<script>
import {auth} from "../auth.js"
//import router from '../router/index.js'

import Modal from './Gui/Modal/Modal'

export default {
    //    props: ["embed"],
    components: {
        Modal
    },
    data() {
        return {
            embed: false,
            isModalOpen: true,
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
                alert: true,
                hidden: (this.infoBox.message.length < 1),
                error: (this.infoBox.status === "error"),
                info: (this.infoBox.status === "info"),
                success: (this.infoBox.status === "success")
            }
        }
    },
    methods: {
        closeModal() {
            this.isModalOpen = false
        },
        loggedIn() {
            if (auth.hasActiveUser()) {
                //TODO this.user=
                return true
            }
            else {
                return false
            }
        },
        login() {
            // TODO JWT token auth
            let that = this
            auth.login(this.user.username, this.user.password).then(() => {
                that.infoBox.status = "success"
                that.infoBox.message = "Your account was logged in successfully"
                this.$resetStore()

                setTimeout(() => {
                    // TODO get Store observable changes working so we don't need to reload
                    window.location.reload()
                }, 200)

                //that.$router.replace('/')
                this.$forceUpdate()
            })
                .catch(async (error) => {
                    that.infoBox.status = "error"
                    const errorData = await error.data

                    if (errorData.error) {
                        this.infoBox.message = 'The account could not be created for the following reason: ' + errorData.error
                    }
                    else {
                        let errorText = "<ul>"
                        for (let [key, value] of Object.entries(errorData)) {
                            errorText += `<li><b>${key}</b>: ${value}</li>`
                        }
                        errorText += "</ul>"
                        this.infoBox.message = `The account could not be created for the following reasons: <br> ${errorText}`
                    }
                })
        },
        logout() {
            this.infoBox.status = "info"
            this.infoBox.message = "You have been logged out"
            console.log('logout')

            auth.logout()
            setTimeout(() => {
                // TODO get Store observable changes working so we don't need to reload
                window.location.reload()
            }, 200)

            this.$resetStore()
            this.$forceUpdate()
        }
    }
}
</script>

<style lang="scss">
#login-form {
    display: flex;
    align-self: center;
    width: 320px;
    fieldset {
        width: 100%;
    }
}
</style>
