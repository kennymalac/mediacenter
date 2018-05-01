<template>
    <div class="content-item">
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
    }
}
</script>

<style lang="scss">
.content-item {
    display: inline-flex;
    flex-direction: column;
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 4px / 5px;
    width: 333px;
    height: 240px;
    .actions {
        display: flex;
        align-self: flex-end;
        height: 54px;
        width: 100%;
        .action {
            background-color: #dbe4ed;
            user-select: none;
            width: 110px;
            border: 1px solid rgba(52, 73, 94,1.0);
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
        height: calc(100% - 54px);
    }
}
</style>
