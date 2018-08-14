<template>
    <section class="sidebar">
        <div class="group-info">
            <div class="icon-container">
                <img v-if="instance.picture" height="100%" width="100%" :src="instance.picture" />
                <i v-if="instance.icon" :class="instance.icon"></i>
            </div>
            <h2>{{ instance.name }}</h2>

            <tag-list :tags="instance.interests" tagType="interest" />
            <!-- <tag-list :tags="instance.contentTypes" tagType="interest" /> -->

            <p class="description">{{ instance.description }}</p>

            <button type="button" v-if="isActiveUserOwner" @click="$emit('editFeed')">
                <i class="ion-md-create"></i> Edit
            </button>

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

export default {
    components: {TagList},
    props: {
        isActiveUserOwner: [Boolean],
        instance: [Object]
    }
}
</script>
