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
            <router-link tag="div" v-if="commentsUrl" :to="commentsUrl" class="action">
                <i class="icon ion-md-chatbubbles"></i>
                <span class="text">Comment</span>
            </router-link>
            <div class="action">
                <i class="icon ion-md-star"></i>
                <span class="text">Save</span>
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
        commentsUrl: {
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

    span.local-tag {
        padding-left: 5px;
        font-weight: bold;
        i {
            color: #f87373;
        }
        color: #4F8A10;
    }

    .content-title {
        justify-content: center;
        display: flex;
        flex-direction: row;

        &:hover, &:focus {
            box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.05);
        }

        color: white;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));

        padding-top: 5px;
        height: $title-height;
        font-size: 1.5rem;
        line-height: 1.5rem;
        font-weight: lighter;
        width: 100%;
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
            color: white;
            text-decoration: none;
            &.external-link {
                text-decoration: underline;
            }
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
        margin-bottom: 10px;
        display: flex;
        height: $actions-height;
        justify-content: center;
        width: 100%;
        .action {
            text-align: center;
            justify-content: center;
            display: flex;
            flex-direction: column;
            background-color: #1F8DD6;
            box-shadow: 0 0.3rem 0 #26619C;
            border-radius: 3px;

            color: white;
            user-select: none;
            width: 120px;
            margin-right: 10px;
            padding: 2px 16px;
            height: 100%;
            span.text {
                font-size: .75rem;
                line-height: 1rem;
            }
            i.icon {
                padding-top: 2px;
                display: flex;
                font-size: 1.6rem;
                margin: auto;
            }
            i.icon.ion-md-star {
                color: #f1c40f;
            }
            &:active {
                box-shadow: none;
                margin-top: .3rem;
            }
        }
        .action:hover {
            cursor: pointer;
            background-color: #239ef0;
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
