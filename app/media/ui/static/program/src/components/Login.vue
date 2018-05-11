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
import router from '../router/index.js'

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
    mounted() {
        console.log('mounted')
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
            auth.login(this.user.username, this.user.password, (error) => {
                that.infoBox.status = "error"
                that.infoBox.message = 'The account could not be logged in for the following reason: ' + error
            }).then(() => {
                that.infoBox.status = "success"
                that.infoBox.message = "Your account was logged in successfully"
                router.replace('/')
                this.$forceUpdate()
            })
        },
        logout() {
            this.infoBox.status = "info"
            this.infoBox.message = "You have been logged out"
            console.log('logout')
            auth.logout()
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
