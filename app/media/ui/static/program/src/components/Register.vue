<template>
    <div class="pure-u-1-2">
        <form v-on:submit.prevent="register" class="pure-form pure-form-aligned">
            <div v-bind:class="info">
                {{ infoBox.message }}
            </div>

            <fieldset>
                <div class="pure-control-group">
                    <label for="name">Username</label>
                    <input v-model="username" type="text" placeholder="Username">
                </div>

                <div class="pure-control-group">
                    <label for="name">Display Name</label>
                    <input v-model="first_name" id="first-name" type="text" placeholder="First Name">
                    <input v-model="last_name" id="last-name" type="text" placeholder="Surname">
                </div>

                <div class="pure-control-group">
                    <label for="country">Country of Residence</label>
                    <!-- <select v-model="country" id="country"> -->
                    <!--     <option v-for="country in countries" value="{country}">{{ country }}</option> -->
                    <!-- </select> -->
                </div>

                <div class="pure-control-group">
                    <label for="password">Password</label>
                    <input v-model="password" id="password" type="password" placeholder="Password">
                </div>

                <div class="pure-control-group">
                    <label for="retype-password">Re-type Password</label>
                    <input v-model="retype_password" id="retype-password" type="password" placeholder="Password">
                </div>

                <div class="pure-control-group">
                    <label for="email">Email Address</label>
                    <input v-model="email" id="email" type="email" placeholder="Email Address">
                </div>

                <div class="pure-control-group">
                    <label for="subscribe">I wish to subscribe to the mailing list</label>
                    <input v-model="subscribe" id="subscribe" type="checkbox"> 
                </div>

                <div class="pure-control-group">
                    <input type="submit" class="pure-button pure-button-primary" text="Submit" />
                </div>

            </fieldset>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
                hidden: (this.infoBox.message.length < 1),
                error: (this.infoBox.status === "error"),
                info: (this.infoBox.status === "info"),
                success: (this.infoBox.status === "success")
            }
        }
    },
    methods: {
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
