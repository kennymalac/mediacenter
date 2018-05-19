<template>
    <div class="dashboard">
        <h1>Portal</h1>
        
        <!-- <select> -->
        <!--     <option selected>Your feeds</option> -->
        <!--     <option>Activity</option> -->
        <!-- </select> -->
        
        <!-- <action-button v-bind="uploadAction" /> -->
        <!-- <action-button v-bind="createContentItemAction" /> -->

        <content-item-form />

        <h2>Recent Activity</h2>
        <!-- <activity-feed /> -->
        <span class="author">Ken</span> replied to your post.
    </div>
</template>

// landing page for guests
// central hub/portal for users
<script>
import ActionButton from './ActionButton'
import ContentItemForm from './ContentItemForm'

export default {
    name: "home",
    components: {
        ActionButton,
        ContentItemForm
    },
    data() {
        return {
            createContentItemAction: {
                icon: "ion-md-list-box",
                title: "Create a Post",
                link: "/",
                extraIcon: "ion-md-add-circle"
            },
            uploadAction: {
                icon: "ion-md-list-box",
                title: "Upload content",
                link: "/",
                extraIcon: "ion-md-add-circle"
            }
        }
    }
}
</script>

<style scoped>
</style>

