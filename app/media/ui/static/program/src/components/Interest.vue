<template>
    <div class="profiles-container grid">
        <template v-if="actions.details && instance.id">
            <div class="profile-container">
                <h1>{{ instance.name }}</h1>
                <p>{{ interestedUsers.length }} User(s) have this interest</p>
                <profile-list v-if="interestedUsers.length" :items="interestedUsers" />
            </div>
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
            this.instance = await this.showInstance(params.id, '/feed/list', interests)

            if (params.id !== this.$store.interestId) {
                // Reset store
                this.$store.interestedUsers = {}
                this.$store.interestId = params.id
            }

            const interested = await interestedUsers()
            this.interestedUsers = interested.values
        }
    }
}
</script>
