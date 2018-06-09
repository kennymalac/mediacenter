<template>
    <div class="activity-log-list">
        <activity-log-item v-for="log in items" v-bind="log.instance" />
    </div>
</template>

<script>
import ActivityLogItem from './ActivityLogItem'

export default {
    props: ['items'],
    components: {
        ActivityLogItem
    }
}
</script>

<style lang="scss">
</style>
