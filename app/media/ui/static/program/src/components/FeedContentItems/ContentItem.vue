<template>
    <div class="content-item" :class="contentItemClass">
        <slot name="title">
            <div class="content-title">
                <div class="content-title-inner">
                    <div class="content-type-container">
                        <slot name="content-type">
                        </slot>
                    </div>

                    <div class="content-link-container">
                        <slot name="content-link" :slotProps="{ title: truncate(title) }">
                            <router-link class="header" :to="detailsUrl" v-html="truncate(title)"></router-link>
                        </slot>
                    </div>

                    <context-menu v-if="showMenu" :menuItems="menuItems" />
                    <context-menu v-if="!showMenu" class="hidden" :menuItems="[]" />
                </div>
                <span v-if="Number.isInteger(postCount)" class="post-count">{{ postCount }} {{ postCount !== 0 && postCount < 2 ? postNoun : postNounPlural }}</span>
            </div>
        </slot>

        <div class="content-item-inner">
            <div v-if="groupId && showGroupTag" style="color: grey; font-size: .8rem;">
                Group: <tag-list className="tag-box" :tags="[{name: groupName, id: groupId}]" tagType="group" />
                <span v-if="isLocal" class="local-tag"><i class="ion-ios-pin"></i> Local</span>
            </div>

            <div v-if="!groupId && isLocal" class="local-tag"><i class="ion-ios-pin"></i> Local</div>

            <span class="date">
                <router-link v-if="!isAnonymous" href="#" :to="userProfile" class="author">{{ owner.profile.display_name }}</router-link>
                <span v-else>Anonymous</span>
                <span style="padding-left: 3px"> {{ created.fromNow() }}</span>
            </span>

            <div style="color: grey; font-size: .8rem; line-height: .8rem;" v-if="lastChild && lastChild.id">
                <span style="padding-right: 3px" v-html="truncate(lastChild.title, 25)"></span>
                <router-link v-if="!lastChild.is_anonymous" href="#" :to="lastChildUserProfile" class="author">{{ lastChild.owner.profile.display_name }}</router-link>
                <span v-else>Anonymous</span>
                <span style="padding-left: 3px"> {{ lastChild.created.fromNow() }}</span>
            </div>

            <slot name="embed" :slotProps="slotProps">
            </slot>
        </div>
        <div class="actions">
            <router-link tag="div" v-if="commentsUrl" :to="commentsUrl" class="action">
                <i class="icon ion-md-chatbubbles"></i>
                <span class="text">Comment</span>
            </router-link>
            <!-- <context-menu style="height: 100%" placement="top" :menuItems="saveActionMenuItems"> -->
            <!--     <div slot="button" class="action"> -->
            <!--         <i class="icon ion-md-star"></i> -->
            <!--         <span class="text">Save</span> -->
            <!--     </div> -->
            <!--  </context-menu> -->
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
        description: {
            type: String,
            default: ""
        },
        owner: {
            type: Object
        },
        lastChild: {
            type: Object,
            required: false
        },
        isPinned: {
            type: Boolean,
            default: false
        },
        isAnonymous: {
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
        postNoun: {
            type: String,
            default: "comment"
        },
        postNounPlural: {
            type: String,
            default: "comments"
        },
        postCount: {
            type: Number,
            required: false
        },
        showGroupTag: {
            type: Boolean,
            default: true
        },
        embedProps: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        slotProps() {
            return { ...this.embedProps, description: this.truncate(this.description, 95) }
        },
        contentItemClass() {
            return {
                pinned: this.isPinned
            }
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
        },
        lastChildUserProfile() {
            if (this.lastChild && this.lastChild.id && !this.lastChild.is_anonymous) {
                console.log(this.lastChild)
                return { name: 'Profile', params: { profileId: this.lastChild.owner.profile.id, profileAction: 'details' } }
            }
        }
    },
    methods: {
        togglePin() {
            this.$emit('togglePin')
            this.$forceUpdate()
        },
        truncate(value, length = 48) {
            return value.length > length ? `${value.slice(0, length)}&hellip;` : value
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";
$actions-height: 70px;
$title-height: 72px;

.content-item.pinned::after {
    position: absolute;
    top: -5px; bottom: -3px;
    left: -3px; right: -3px;
    background: linear-gradient(to bottom, #F7DF1E, #F7A31E, #2c3e50 40%);
    content: '';
    z-index: -1;
    border-radius: 4px / 5px;
}
.content-item {
    vertical-align: top;
    background-color: white;
    position: relative;
    margin: 10px;
    display: inline-flex;
    flex-direction: column;
    &:not(.pinned) {
        border: 3px solid rgba(52, 73, 94,1.0);
        border-radius: 4px / 5px;
    }
    width: 333px;
    height: 290px;
    &.pinned {
        height: 287px;
    }

    .tag-box {
        display: inline-block;
        .group-tag {
            font-size: .8rem;
        }
    }
    .content-item-inner {
        padding-top: 2px;
    }

    span.local-tag {
        padding-left: 5px;
        font-weight: bold;
        i {
            color: #f87373;
        }
        color: #4F8A10;
    }

    .content-title {
        display: flex;
        flex-direction: column;

        &:hover, &:focus {
            box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.05);
        }
        height: $title-height;

        color: white;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
        .post-count {
            font-size: .8rem;
        }
    }
    .content-link-container {
        width: 76%;
        //overflow-y: hide;
        word-wrap: break-word;
        margin-left: auto;
    }

    .content-title-inner {
        width: 100%;
        justify-content: space-between;
        display: flex;
        flex-direction: row;
        padding-top: 5px;
        padding-bottom: 5px;
        font-size: 1.2rem;
        line-height: 1.2rem;
        height: 3rem;
        font-weight: lighter;
        width: 100%;

        .context-menu {
            &.hidden { visibility: hidden; }
            margin-left: auto;
        }
        i { font-size: 1.5rem; }
        .content-type-container {
            width: 32px;
        }
        .content-type {
            font-size: .8rem;
            display: inline-flex;
            border-radius: 6px;
            background: linear-gradient(#2dabff 70%, #1F8DD6);
            color: white;
            font-weight: normal;
            padding: 4px;
            margin-left: 8px;
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
        font-size: .8rem;
        line-height: .8rem;
        color: grey;
    }

    .actions {
        margin-bottom: 10px;
        position: absolute;
        top: 78%;
        display: flex;
        height: $actions-height;
        justify-content: center;
        width: 100%;
        .action {
            transition: $picnic-transition;
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
        i { font-size: 10rem; }
        width: 100%;
        height: calc(100% - #{$actions-height} - #{$title-height});
    }
}
</style>
