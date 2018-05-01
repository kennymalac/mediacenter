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
                    <input class="stack" v-model="username" type="text" placeholder="Username">
                    <label class="stack" for="name">Display Name</label>
                    <input class="stack" v-model="first_name" id="first-name" type="text" placeholder="First Name">
                    <input class="stack" v-model="last_name" id="last-name" type="text" placeholder="Last Name">
                    <label class="stack" for="password">Password</label>
                    <input class="stack" v-model="password" id="password" type="password" placeholder="Password">
                    <label class="stack" for="retype-password">Re-type Password</label>
                    <input class="stack" v-model="retype_password" id="retype-password" type="password" placeholder="Password">
                    <label class="stack" for="email">Email Address</label>
                    <input class="stack" v-model="email" id="email" type="email" placeholder="Email Address">
                    
                    <label class="stack">
                        <input name="subscribe" type="checkbox" />
                        <span class="checkable">I wish to subscribe to the mailing list</span>
                    </label>
                    
                    <input class="stack" v-model="subscribe" id="subscribe" type="checkbox">
                    <!-- TODO must be over 13 -->
                    <input class="stack" type="submit" text="Submit" />
                </fieldset>
            </form>
        </Modal>
    </div>
</template>

<script>
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
        register(data) {
            //"Please enter the following information below."
            fetch('/api/accounts/create', {
                method: 'POST',
                data: {
                    username: data.username,
                    email: data.email,
                    country: data.country,
                    first_name: data.firstName,
                    last_name: data.lastName,
                    password: data.password,
                    user_settings: {}
                }
            })
                .then(() => {
                    this.infoBox.status = "success"
                    //this.router.navigate home
                })
                .catch((error) => {
                    this.infoBox.status = "error"
                    this.infoBox.message = 'The account could not be created for the following reason: ' + error
                })
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

