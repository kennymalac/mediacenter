<template>
    <section class="sidebar">
        <div class="group-info">
            <div @click="$emit('details')" class="icon-container">
                <img v-if="instance.picture" height="100%" width="100%" :src="instance.picture" />
                <i v-if="instance.icon" :class="instance.icon"></i>
            </div>
            <h2 @click="$emit('details')">{{ instance.name }}</h2>

            <tag-list :tags="instance.interests" tagType="interest" />
            <!-- <tag-list :tags="instance.contentTypes" tagType="interest" /> -->

            <p class="description">{{ instance.description }}</p>

            <button type="button" v-if="showEdit && isActiveUserOwner" @click="$emit('editFeed')">
                <i class="ion-md-create"></i> Edit
            </button>

            <delete-button v-if="showDelete && isActiveUserOwner && !instance.is_local && !instance.default_owner_feed" objectName="feed" @delete="$emit('deleteFeed')" />

            <!-- <h3>Filters</h3> -->
            <!-- <feed-filter :specifiers="filters.contentTypes" :filterToggled="toggle" /> -->
            <!-- <feed-filter :specifiers="filters.subjects" :filterToggled="toggle" /> -->
            <!-- <feed-filter :specifiers="filters.interests" :filterToggled="toggle" /> -->
            <!-- <feed-filter :specifiers="filters.tags" :filterToggled="toggle" /> -->
        </div>
    </section>
</template>

<script>
import TagList from './TagList'
import DeleteButton from './Gui/DeleteButton'

export default {
    components: {TagList, DeleteButton},
    props: {
        isActiveUserOwner: [Boolean],
        instance: [Object],
        showEdit: {
            type: Boolean,
            default: false
        },
        showDelete: {
            type: Boolean,
            default: false
        }
    }
}
</script>
