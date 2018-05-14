<template>
    <div>
        <div :class="info">
            {{ infoBox.message }}
        </div>
        
        <Modal :isOpen="isModalOpen" :onClose="closeModal" justifyContent="center" :titleProps="{ title: 'Register' }">
            <form id="register-form" @submit.prevent="register">
                <fieldset>
                    <legend>User details</legend>
                    <label class="stack" for="name">Username</label>
                    <input class="stack" v-model="instanceForm.username" type="text" placeholder="Username">
                    <label class="stack" for="name">Display Name</label>
                    <input class="stack" v-model="instanceForm.display_name" type="text" placeholder="Display Name">
                    <label class="stack" for="password">Password</label>
                    <input class="stack" v-model="instanceForm.password" id="password" type="password" placeholder="Password">
                    <label class="stack" for="retype-password">Re-type Password</label>
                    <input class="stack" v-model="instanceForm.retype_password" id="retype-password" type="password" placeholder="Password">
                    <label class="stack" for="email">Email Address</label>
                    <input class="stack" v-model="instanceForm.email" id="email" type="email" placeholder="Email Address">
                    
                    <label class="stack">
                        <input name="subscribe" class="stack" v-model="instanceForm.subscribe" id="subscribe" type="checkbox">
                        <span class="checkable">I wish to subscribe to the mailing list</span>
                    </label>
                    
                    <!-- TODO must be over 13 -->
                    <input type="submit" class="stack" value="Submit" />
                </fieldset>
            </form>
        </Modal>
    </div>
</template>

<script>
import {AccountCollection} from '../models/Account.js'
import Modal from './Gui/Modal/Modal'

export default {
    components: {
        Modal
    },
    data() {
        return {
            isModalOpen: true,
            infoBox: {
                status: "",
                message: ""
            },
            instanceForm: {
                username: "",
                display_name: "",
                password: "",
                retype_password: "",
                email: "",
                subscribe: ""
            }
        }
    },
    computed: {
        info() {
            //return Your account was created successfully
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
        register() {
            AccountCollection.create({
                username: this.instanceForm.username,
                email: this.instanceForm.email,
                country: this.instanceForm.country,
                // display_name: this.instanceForm.display_name,
                password: this.instanceForm.password,
                profile: {
                    display_name: this.instanceForm.display_name
                },
                account_settings: {}
            })
                .then(() => {
                    this.infoBox.status = "success"
                    this.infoBox.message = 'Your account was successfully created. Please login.'
                    //this.router.navigate home
                })
                .catch((error) => {
                    this.infoBox.status = "error"
                    this.infoBox.message = 'The account could not be created for the following reason: ' + error
                })
            //"Please enter the following information below."
        }
    }
}
</script>

<style lang="scss">
#register-form {
    display: flex;
    align-self: center;
    width: 640px;
    fieldset {
        width: 100%;
    }
}
</style>

