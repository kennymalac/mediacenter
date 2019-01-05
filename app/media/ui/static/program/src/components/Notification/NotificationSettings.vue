<template>
    <div class="grid feed-container">
        <section class="notifications">
            <h1>Notifications</h1>
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Settings</legend>

                    <notification-preference v-for="preference in preferences"
                        :frequency.sync="preference.frequency"
                        :name.sync="preference.name"
                        :enabled.sync="preference.enabled" />
                    <!-- <label class="stack" for="rules">Rules</label>
                         TODO rules -->
                        <!-- <label class="stack" for="">Tags</label> -->
                        <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                        <input class="stack" type="submit" value="Save changes" />
                    </fieldset>
                </form>
        </section>
    </div>
</template>

<script>
import {activeUser, accounts, profiles} from '../../store.js'

import NotificationPreference from './NotificationPreference'

export default {
    name: 'notification-settings',
    components: { NotificationPreference },
    data() {
        return {
            instanceForm: {},
            preferences: [
                { name: "Someone replies to a topic I've created", frequency: 'instantly', enabled: true },
                { name: "Someone comments on content I've posted", frequency: 'instantly', enabled: true },
                { name: "Someone replies to my comment", frequency: 'instantly', enabled: true },
                { name: "Someone comments on my profile", frequency: 'instantly', enabled: true }
            ]
        }
    },
    methods: {
        async save() {
            console.log('form submit')
            const accountCollection = await accounts()
            const user = await accountCollection.fetchInstance((await activeUser()).details.id, { profile: await profiles() })
            console.log(user)

            const settings = {}
            settings.reply_owned_topic = this.preferences[0].enabled
            settings.comment = this.preferences[1].enabled
            settings.reply_comment = this.preferences[2].enabled
            settings.profile_comment = this.preferences[3].enabled

            this.instanceForm.notify_settings = settings

            await accountCollection.manage(user, this.instanceForm)
        }
    }
}
</script>

<style lang="scss">
</style>
