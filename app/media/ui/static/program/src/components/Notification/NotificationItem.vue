<template>
    <div v-if="subtype === 'reply_topic'" class="notification-item">
        <div class="icon-container icon-container-xs"> <img :src="log.author.profile.picture" /></div>
        <span class="notification-text">{{log.author.profile.display_name}} replied in a topic you created {{log.context.instance.content_item.title}}</span>
    </div>
</template>

<script>
export default {
    name: 'notification-item',
    props: {
        subtype: String,
        log: Object
    },
    components: {}
}
</script>

<style lang="scss">
.notification-item {
    padding: .5rem .25rem 0rem .25rem;
    display: flex;
    align-items: center;
    text-align: center;
    //border: 1px solid white;
    //border-radius: 3px;

    &:hover {
        cursor: pointer;
        background-color: #eee;
    }

    &.read {
        .icon-container { opacity: .5; }
        color: grey;
    }
    span.notification-text {
        padding-left: 5px;
    }
    border-bottom: 1px solid #ccc;
}
</style>
