<template>
    <div class="activity-feed-container">
        <activity-log-list :items="objects" />
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import ActivityLogList from './ActivityLogList'

import {ActivityLogModel} from '../../models/ActivityLog.js'
import {activeUser, activityLogs} from '../../store.js'

//import router from "../../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
        ActivityLogList
    },
    data() {
        return {
            instance: { id: null },
            // logs: { values: [] },
            objectName: 'activityfeed'
        }
    },
    // async mounted() {
    //     this.logs = (await this.$store).values
    // },
    methods: {
        initialState() {
            this.instance = ActivityLogModel.initialState
            this.instanceForm = { members: [], feed: {} }
        },

        async list(params) {
            const activityLogsCollection = await activityLogs()
            const user = await activeUser()

            this.objects = activityLogsCollection.values.all((log) => {
                return log.author.id === user.details.id
            })
        }
    }
}
</script>

<style lang="scss">
.activity-feed-container {

}
</style>
