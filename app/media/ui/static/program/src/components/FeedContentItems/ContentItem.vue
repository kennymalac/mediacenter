<template>
    <div class="content-item">
        <slot name="title">
            <div class="content-title">
                <slot name="content-type">
                </slot>

                <slot name="content-link">
                    <router-link class="header" :to="detailsUrl"> {{ title }}</router-link>
                </slot>

                <context-menu v-if="showMenu" :menuItems="menuItems" />
                <context-menu v-if="!showMenu" class="hidden" :menuItems="[]" />
            </div>
        </slot>
        <span v-if="isPinned" class="pinned">Pinned</span>

        <router-link href="#" :to="userProfile" class="author">{{ owner.profile.display_name }}</router-link>

        <span class="date">
            {{ created.fromNow() }}
            <span class="local-tag" v-if="isLocal"><i class="ion-ios-pin"></i> Local</span>
            <span v-if="groupId && showGroupTag">
                <span v-html="'&nbsp;in'"></span>
                <tag-list className="tag-box" :tags="[{name: groupName, id: groupId}]" tagType="group" />
            </span>
        </span>

        <slot name="embed" :slotProps="embedProps">
        </slot>
        <div class="actions">
            <router-link tag="div" v-if="commentsUrl" :to="commentsUrl" class="action">
                <i class="icon ion-md-chatbubbles"></i>
                <span class="text">Comment</span>
            </router-link>
            <context-menu style="height: 100%" placement="top" :menuItems="saveActionMenuItems" :button="saveButton" />
        </div>
    </div>
</template>

<script>
import FeedContentItem from './mixins/FeedContentItem'
import TagList from '../TagList'
import ContextMenu from '../Gui/ContextMenu'

export default {
    name: 'content-item',
    components: {ContextMenu, TagList},
    mixins: [FeedContentItem],
    props: {
        title: {
            type: String,
            default: ""
        },
        owner: {
            type: Object
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        isLocal: {
            type: Boolean,
            default: false
        },
        groupName: {
            type: String,
            default: ""
        },
        groupId: {
            type: Number,
            default: 0
        },
        detailsUrl: {
            type: String,
            default: ""
        },
        commentsUrl: {
            type: String,
            default: ""
        },
        showMenu: {
            type: Boolean,
            default: false
        },
        showGroupTag: {
            type: Boolean,
            default: true
        },
        embedProps: [Object]
    },
    computed: {
        saveButton() {
            return `
                <div class="action">
                <i class="icon ion-md-star"></i>
                <span class="text">Save</span>
                </div>`
        },
        menuItems() {
            return [
                {
                    name: this.isPinned ? "Unpin" : "Pin",
                    action: this.togglePin.bind(this)
                },
                {
                    name: "Delete",
                    action: () => {}
                }
            ]
        },
        saveActionMenuItems() {
            return [
                {
                    name: "Stash 1",
                    action: () => null
                }
            ]
        },
        userProfile() {
            return { name: 'Profile', params: { profileId: this.owner.profile.id, profileAction: 'details' } }
        }
    },
    methods: {
        togglePin() {
            this.$emit('togglePin')
            this.$forceUpdate()
        }
    }
}
</script>

<style lang="scss">
$actions-height: 70px;
$title-height: 56px;

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

    .tag-box {
        display: inline;
    }

    .content-title {
        justify-content: space-between;
        display: flex;
        flex-direction: row;

        &:hover, &:focus {
            box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.05);
        }

        color: white;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));

        padding-top: 5px;
        padding-bottom: 5px;
        height: $title-height;
        font-size: 1.5rem;
        line-height: 1.5rem;
        font-weight: lighter;
        width: 100%;
        .header { margin-left: auto; }
        .context-menu {
            &.hidden { visibility: hidden; }
            margin-left: auto;
        }
        .content-type {
            display: inline-flex;
            border-radius: 6px;
            background-color: #1F8DD6;
            color: white;
            font-weight: normal;
            padding: 4px;
            margin-left: 8px;
            font-size: .8rem;
        }
        a {
            color: white;
            text-decoration: none;
            &.external-link {
                text-decoration: underline;
            }
        }
    }

    .pinned {
        color: white;
        background-color: orange;
        text-align: center;
        justify-content: center;
        align-items: center;
        padding: 4px;
        font-size: .8rem;
        display: flex;
    }

    .date {
        display: inline-flex;
        position: relative;
        padding-top: .25em;
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
            max-height: 48px;
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
