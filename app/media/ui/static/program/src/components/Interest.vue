<template>
    <div>
        <template v-if="actions.details && instance.id">
            <section class="groups">
                <h1>{{ instance.name }}</h1>
                
                <template v-if="interestedUsers.length">
                    <p>{{ interestedUsers.length }} User(s) have this interest</p>
                    <profile-list :items="interestedUsers" />
                </template>
            </section>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import {interests, interestedUsers} from '../store.js'
import ProfileList from './Profile/ProfileList'

export default {
    mixins: [RestfulComponent],
    components: {
        ProfileList
    },
    data() {
        return {
            instance: { id: null, name: '' },
            interestedUsers: []
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, name: '' }
            this.interestedUsers = []
        },

        async list(params) {
            const store = await interests()
            this.objects = store.values
        },

        async details(params) {
            if (params.id !== this.$store.interestId) {
                // Reset store
                this.$store.interestedUsers = {}
                this.$store.interestId = params.id
            }

            this.instance = await this.showInstance(params.id, '/feed/list', interests)
            const interested = await interestedUsers(params.id)
            this.interestedUsers = interested.values
        }
    }
}
</script>

