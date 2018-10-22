<template>
    <div class="grid feed-container">
        <section class="notifications">
            <h1>Notifications</h1>
            <notification-item v-for="item in notifications" v-bind="item" />
        </section>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"

import {notifications} from '../../store.js'

import logDeps from '../../dependencies/ActivityLog.js'
import {ActivityLogModel} from '../../models/ActivityLog.js'

import NotificationItem from './NotificationItem'

export default {
    name: 'notification',
    mixins: [RestfulComponent],
    components: {NotificationItem},
    data() {
        return {
            objectName: 'notification',
            notifications: []
        }
    },
    watch: {
        async objects(newVal) {
            console.log(newVal)
            this.notifications = await Promise.all(newVal.map((item) => {
                return this.resolve(item)
            }))
            console.log(this.notifications)
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
        },

        async list(params) {
            const store = await notifications()
            this.objects = store.values.all()
        },

        async resolve(instance) {
            console.log('i', instance)
            const log = await ActivityLogModel.resolveLog(
                instance.log, await logDeps(instance.log.action, instance.log.context.stash)
            )
            return {...instance.instance, log}
        }
        // async details(params) {
        //     const user = await activeUser()
        //     const deps = await notificationDeps()
        //     this.instance = await this.showInstance(params.id, 'notification/list', notifications, deps)

        // }
    }
}
</script>

<style lang="scss">
</style>
