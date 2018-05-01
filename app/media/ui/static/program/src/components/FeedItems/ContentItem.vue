<template>
    <div class="content-item">
        <slot name="title">
            <div class="content-title">
                Test by <a href="#" @click.native="userProfile" class="author">@datboi</a>
            </div>
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
                <span>Favorite</span>
            </div>
            <div class="action">
                <i class="icon ion-md-close"></i>
                <span>Hide</span>
            </div>
        </div>
    </div>
</template>

<script>
import FeedItem from './mixins/FeedItem'

export default {
    name: 'content-item',
    mixins: [FeedItem],
    props: {
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
$title-height: 24px;

.content-item {
    display: inline-flex;
    flex-direction: column;
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 4px / 5px;
    width: 333px;
    height: 280px;
    
    .content-title {
        height: $title-height;
        font-size: 1.4rem;
        width: 100%;
        color: rgb(52, 73, 94);
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
