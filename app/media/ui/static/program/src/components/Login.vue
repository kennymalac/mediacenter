<template>
    <div>
        <info-box preErrorMessage="The account could not be logged in" :message="infoBoxMessage" :errorData="infoBoxErrorData" :status="infoBoxStatus" />

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
import InfoBox from './Gui/InfoBox'

export default {
    //    props: ["embed"],
    components: {
        InfoBox,
        Modal
    },
    data() {
        return {
            embed: false,
            isModalOpen: true,
            infoBoxStatus: "",
            infoBoxMessage: "",
            infoBoxErrorData: {},
            user: {
                username: "",
                password: ""
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
                const {username} = auth.getActiveUser().details
                this.user = {...this.user, username}

                return true
            }
            else {
                return false
            }
        },
        login() {
            // TODO JWT token auth
            auth.login(this.user.username, this.user.password).then(() => {
                this.infoBoxStatus = "success"
                this.infoBoxMessage = "Your account was logged in successfully"
                this.$resetStore()

                setTimeout(() => {
                    // TODO get Store observable changes working so we don't need to reload
                    this.$router.replace('/feed')
                    window.location.reload()
                }, 200)

                this.$forceUpdate()
            })
                .catch(async (error) => {
                    this.infoBoxStatus = "error"
                    this.infoBoxErrorData = await error.data
                })
        },
        logout() {
            this.infoBoxStatus = "info"
            this.infoBoxMessage = "You have been logged out"
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
