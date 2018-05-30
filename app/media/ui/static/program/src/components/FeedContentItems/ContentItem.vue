<template>
    <div class="content-item">
        <slot name="title">
            <div class="content-title">
                {{ title }} <a href="#" @click.native="userProfile" class="author">@datboi</a>
            </div>
            <span class="date">{{ created.fromNow() }}</span>
        </slot>
        <slot name="embed" :slotProps="embedProps">
        </slot>
        <div class="actions">
            <div class="action">
                <i class="icon ion-md-chatbubbles"></i>
                <span>Comment</span>
            </div>
            <div class="action">
                <i class="icon ion-md-star"></i>
                <span>Save</span>
            </div>
            <div class="action">
                <i class="icon ion-md-close"></i>
                <span>Hide</span>
            </div>
        </div>
    </div>
</template>

<script>
import FeedContentItem from './mixins/FeedContentItem'

export default {
    name: 'content-item',
    mixins: [FeedContentItem],
    props: {
        title: {
            type: String,
            default: ""
        },
        embedProps: [Object]
    },
    methods: {
        userProfile(event) {
            event.preventDefault()
        }
    }
}
</script>

<style lang="scss">
$actions-height: 54px;
$title-height: 48px;

.content-item {
    margin: 10px;
    display: inline-flex;
    flex-direction: column;
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 4px / 5px;
    width: 333px;
    height: 280px;
    
    .content-title {
        padding-top: 5px;
        height: $title-height;
        font-size: 1.5rem;
        line-height: 1.5rem;
        font-weight: lighter;
        width: 100%;
        color: rgb(52, 73, 94);
        .content-type {
            display: inline-flex;
            border-radius: 6px;
            background-color: #1F8DD6;
            color: white;
            font-weight: normal;
            padding: 4px;
            font-size: 1rem;
        }
        a {
            text-decoration: underline;
        }
    }
    .date {
        display: inline-flex;
        position: relative;
        padding-top: 1em;
        align-self: center;
        color: grey;
    }
    
    .actions {
        display: flex;
        align-self: flex-end;
        height: $actions-height;
        width: 100%;
        .action {
            background-color: #2c3e50;
            color: white;
            user-select: none;
            width: 110px;
            padding: 2px 16px;
            height: 100%;
            i.icon {
                padding-top: 2px;
                display: flex;
                font-size: 1.6rem;
                margin: auto;
                width: 28px;
                height: 24px;
            }
        }
        .action:hover {
            box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.2);
            cursor: pointer;
        }
    }
    .default-preview {
        justify-content: center;
        align-items: center;
        i { font-size: 10rem; }
        display: flex;
        width: 100%;
        height: calc(100% - #{$actions-height} - #{$title-height});
    }
}
</style>
