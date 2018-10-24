<template>
    <div style="display: inline-block;">
        <popper ref="popper" trigger="click" @show="$emit('toggle', true)" @hide="$emit('toggle', false)" :options="options">
            <div class="popper">
                <div class="notification-embed-list" v-if="notifications.length > 0">
                    <notification-item v-for="item in notifications" v-bind="item" class="popover-item" />
                </div>
                <div v-else>No notifications</div>
                <div class="all-notifications-text">
                    <router-link to="/notification">
                        View all notifications
                    </router-link>
                </div>
            </div>
            <template slot="reference">
                <slot name="button">
                    <div>
                        <span class="unread-notification-count" v-if="notifications.length">{{notifications.length}}</span>
                        <button type="button" class="pseudo icon"><div style="height: 100%; font-size: 1.5rem;">
                                <i class="ion ion-md-notifications" />
                        </div></button>
                    </div>
                </slot>
            </template>
        </popper>
    </div>
</template>

<script>
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/css/vue-popper.css'

import NotificationItem from './NotificationItem'

export default {
    props: {
        placement: {
            type: String,
            default: 'bottom'
        },
        button: {
            type: String,
            default: ``
        }
    },
    components: {
        Popper,
        NotificationItem
    },
    computed: {
        options() {
            return { placement: this.placement }
        }
    },
    data() {
        return {
            isMenuOpen: false,
            notifications: []
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        },
        selectMenuItem(event, action) {
            this.$refs.popper.doClose()
            action(event)
        }
    }
}
</script>

<style lang="scss">
.unread-notification-count {
    display: inline-block;
    position: relative;
    left: 80%;
    top: -10px;
    color: white;
    background-color: #eb3636;
    border: 1px solid transparent;
    border-radius: 50%;
    font-size: .7rem;
    line-height: 1rem;
    font-weight: bold;
    min-width: 1rem;
    min-height: 1rem;
}
.all-notifications-text {
    padding: .5rem .25rem 0rem .25rem;
    display: flex;
    align-items: center;
    text-align: center;
}
.notification-embed-list {
    overflow-y: scroll;
    max-height: 300px;
}
</style>
