<template>
    <section class="sidebar">
        <div class="group-info">
            <div class="icon-container">
                <img height="100%" width="100%" :src="instance.image" />
            </div>
            <h2>{{ instance.name }}</h2>

            <div v-if="instance.members.length !== 1">{{ instance.members.length }} Members</div>
            <div v-if="instance.members.length === 1">{{ instance.members.length }} Member</div>

            <tag-list :tags="instance.feed.interests" tagType="interest" />

            <p class="description">{{ instance.description }}</p>
            <div class="rules" v-if="instance.rules.length > 0">
                <h3>Rules</h3>
                <ol>
                    <li v-for="rule in instance.rules">{{ rule }}</li>
                </ol>
            </div>

            <button type="button" v-if="isActiveUserOwner" @click="$emit('editGroup')">
                <i class="ion-md-create"></i> Edit
            </button>

            <button type="button" v-if="!isActiveUserMember && !instance.is_restricted" @click="$emit('joinGroup')">
                <i class="ion-ios-contacts"></i> Join
            </button>
            <context-menu style="display: inline" v-if="isActiveUserMember" :menuItems="leaveMenuItems">
                <button type="button" slot="button" class="warning">
                    <i class="ion-md-exit"></i> Leave
                </button>
            </context-menu>

            <!-- <div class="who-is-online"> -->
                <!--      <h3><div class="online-circle"></div> {{ onlineMembers.length }} User(s) online now</h3> -->
                <!-- </div> -->
        </div>
    </section>

</template>

<script>
import ContextMenu from '../Gui/ContextMenu'
import TagList from '../TagList'

export default {
    components: {ContextMenu, TagList},
    props: {
        isActiveUserMember: [Boolean],
        isActiveUserOwner: [Boolean],
        instance: [Object]
    },
    computed: {
        leaveMenuItems() {
            return [
                {
                    name: "Yes, leave this group",
                    action: () => this.$emit('leaveGroup')
                }
                // {
                //     name: "No",
                //     action: () => {}
                // }
            ]
        }
    }
}
</script>
