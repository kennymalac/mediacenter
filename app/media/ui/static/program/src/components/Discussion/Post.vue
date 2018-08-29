<template>
    <div class="post">
        <div class="post-header">
            <div @click="$emit('userProfile')"  class="author">
                <div class="profile-picture icon-container">
                    <img v-if="content_item.owner.profile.picture" :src="content_item.owner.profile.picture" />
                    <i v-if="!content_item.owner.profile.picture" class="ion-md-person"></i>
                </div>

                <div v-if="!content_item.is_anonymous" class="author-details">
                    <span class="display-name">{{ content_item.owner.profile.display_name }}</span>
                    <span class="user-title">{{ userTitle }}</span>
                </div>
                <div v-if="content_item.is_anonymous" class="author-details">
                    <span class="display-name">Anonymous</span>
                    <span class="user-title">{{ userTitle }}</span>
                </div>
            </div>
            <div class="post-details">
                <span class="title">{{ content_item.title }}</span>
                <span class="date">{{ content_item.created.format('LLLL') }}</span>
            </div>
        </div>
        <div v-html="text" class="text"></div>
        <span v-if="text_last_edited.format" class="date" style="padding-left: 20px;">Last edited: {{ text_last_edited.format('LLLL') }}</span>
        <div class="actions" v-if="isActiveUser">
            <button type="button" @click="$emit('editPost')">
                <i class="ion-md-create"></i> Edit
            </button>
            <context-menu style="display: inline" :menuItems="deleteMenuItems">
                <button type="button" slot="button" class="error">
                    <i class="ion-md-close"></i> Delete
                </button>
            </context-menu>
        </div>
    </div>
</template>

<script>
import ContextMenu from '../Gui/ContextMenu'

export default {
    components: {ContextMenu},
    props: {
        content_item: {
            type: Object
        },
        text_last_edited: {
            type: Object
        },
        isActiveUser: {
            type: Boolean,
            default: false
        },
        text: {
            type: String
        },
        userTitle: {
            type: String,
            default: "User"
        }
    },
    data() {
        return {
            deleteMenuItems: [
                {
                    name: "Yes, delete this post",
                    action: () => this.$emit('deletePost')
                }
            ]
        }
    }
}
</script>

<style lang="scss">
.post {
    width: 90%;
    margin: 10px 0;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    text-align: left;
    .date {
        opacity: .5;
        font-size: .8rem;
    }

    .post-header {
        padding: 5px 10px;
        display: flex;
        flex-direction: row;

        .author {
            justify-content: center;
            display: flex;
            width: 240px;

            &:hover, &:focus {
                .icon-container {
                    box-shadow: 1px 1px 20px 0px rgba(255, 255, 255, 0.25);
                }
                .author-details {
                    text-shadow: 1px 1px 2px black;
                }

                cursor: pointer;
            }
            &:active {
                color: #eee;
                .icon-container {
                    opacity: .9;
                    border-style: inset;
                    img {
                        opacity: .8;
                    }
                }
            }

            .profile-picture.icon-container {
                display: inline-flex;
                width: 64px;
                height: 64px;
                color: rgb(52, 73, 94);
                img {
                    height: 100%;
                    border-radius: 50%;
                    width: 100%;
                }
                i {
                    font-size: 2.25rem;
                }
                border-radius: 50%;
                background-color: white;
            }
            .author-details {
                padding-top: 3px;
                padding-left: 8px;
                min-width: 160px;
                display: flex;
                align-items: left;
                flex-direction: column;
                font-size: 0.8em;
                span.display-name {
                    font-weight: 300;
                    font-size: 1.3rem;
                }
                span.user-title {
                    opacity: .75;
                }
            }
        }
        .post-details {
            display: flex;
            align-items: left;
            flex-direction: column;
            .title {
                font-weight: 300;
                font-size: 1.45rem;
            }
        }
        color: white;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
    }
    div.text {
        padding: 10px 20px;
        font-size: 1rem;
    }
    .actions {
        text-align: right;
        padding: 10px;
    }
}
</style>
