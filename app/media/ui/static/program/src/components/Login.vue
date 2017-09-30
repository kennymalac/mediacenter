<template>
    <Modal :isOpen="isModalOpen" :onClose="closeModal">
        <div slot="title">
            <modal-toolbar />

            <label>
                Login
            </label>
        </div>

        <div v-bind:class="info">
          {{ infoBox.message }}
        </div>

        <form v-if="!loggedIn()" v-on:submit.prevent="login">
          <fieldset class="third">
            <input v-model="user.username" class="stack" type="text" placeholder="username" />
            <input v-model="user.password" class="stack" type="password" placeholder="password" />
            
            <input type="submit" class="stack" text="Sign in" />
          </fieldset>
          <label for="remember">
            <input id="remember" type="checkbox">
            <span class="checkable">Remember me</span>
          </label>
          <!-- {% csrf_token %} -->
        </form>

        <div v-if="loggedIn()">
          Welcome {{user.username}}!
          <button @click="logout">Logout</button>
        </div>
    </Modal>
</template>

<script>
import auth from "../auth.js"
import router from '../router/index.js'

import Modal from './Gui/Modal/Modal'
import ModalToolbar from './Gui/Modal/ModalToolbar'
import ModalToolbarItem from './Gui/Modal/ModalToolbarItem'

export default {
    //    props: ["embed"],
    components: {
        Modal,
        ModalToolbar,
        ModalToolbarItem
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
