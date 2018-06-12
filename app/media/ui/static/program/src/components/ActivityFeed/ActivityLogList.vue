<template>
    <div class="activity-log-list">
        <activity-log-item v-for="log in logs" v-bind="log" />
    </div>
</template>

<script>
import ActivityLogItem from './ActivityLogItem'
import {ActivityLogModel} from '../../models/ActivityLog.js'
import logDeps from '../../dependencies/ActivityLog.js'

export default {
    props: ['items'],
    components: {
        ActivityLogItem
    },
    data() {
        return {
            logs: []
        }
    },
    watch: {
        async items(newVal) {
            this.logs = await Promise.all(newVal.map((item) => {
                return this.resolve(item)
            }))
        }
    },
    methods: {
        async resolve(instance) {
            console.log(instance)
            return await ActivityLogModel.resolveLog(
                instance, await logDeps(instance.action, instance.context.stash)
            )
        }
    }
}
</script>

<style lang="scss">
</style>
