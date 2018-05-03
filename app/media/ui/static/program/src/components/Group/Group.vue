<template>
    <div class="group-container">
        <template v-if="actions.list">
            <action-list :actions="groupActions" />
            
            <section class="groups">
                <h1>Your Groups</h1>
                <group-list :items="objects" />
            </section>
        </template>
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <img height="100%" width="100%" :src="instance.image" />
                    </div>
                    <h2>{{ instance.name }}</h2>
                    <p class="description">{{ instance.description }}</p>
                    <div class="rules" v-if="instance.rules.length > 0">
                        <h3>Rules</h3>
                        <ol>
                            <li v-for="rule in instance.rules">{{ rule }}</li>
                        </ol>
                    </div>
                    <div class="who-is-online">
                        <h3><div class="online-circle"></div> {{ onlineMembers.length }} User(s) online now</h3>
                    </div>
                </div>
            </section>
            <div class="group-contents">
                <section class="feed">
                    <feed-content-item-list :items="contentItems" :enabledContentTypes="enabledContentTypes" />
                </section>
            </div>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instance.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instance.description" />
                    <label class="stack" for="image">Image</label>
                    <input class="stack" name="image" v-model="instance.image" type="text" />
                    <!-- <label class="stack" for="rules">Rules</label>
                         TODO rules -->
                    <label class="stack" for="members"></label>
                    <select class="stack" name="members" multiple v-model="instance.members">
                        <option value="1">Ken</option>
                    </select>

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import {GroupCollection, GroupModel} from '../../models/Group.js'
import {FeedModel} from '../../models/Feed.js'

import GroupList from './GroupList'
import FeedContentItemList from '../FeedContentItemList'
import FeedFilter from '../FeedFilter'
import ActionList from '../ActionList'

import router from "../../router/index.js"
import auth from "../../auth.js"

export default {
    mixins: [RestfulComponent],
    components: {
        GroupList,
        FeedContentItemList,
        FeedFilter,
        ActionList
    },
    computed: {
        onlineMembers() {
            // TODO
            return this.instance.members
        },
        enabledContentTypes() {
            return ["Topics"]
        }
    },
    data() {
        return {
            instance: { id: null },
            groupActions: [
                {
                    icon: "ion-ios-people",
                    link: "create",
                    title: "Create a Group",
                    extraIcon: "ion-md-add-circle"
                },
                {
                    link: "",
                    icon: "ion-md-search",
                    title: "Find a Group"
                }
            ],
            contentItems: []
        }
    },
    methods: {
        initialState() {
            this.instance = GroupModel.initialState
            this.contentItems = []
        },
        
        create() {
            this.instance = GroupModel.getNewInstance()
            this.instance.feed = FeedModel.getNewInstance()
            this.instance.owner = auth.getActiveUser().details.id
        },

        manage() {
            
        },

        list(params) {
            return GroupCollection.searchGroups().then((data) => {
                this.objects = data
            })
        },

        details(params) {
            this.instance = this.objects.find((item) => {
                return item.id === parseInt(params.id)
            })
            GroupCollection.get(this.instance.id)
                .then((data) => {
                    this.instance = data
                    // TODO filtering
                    this.feed = data.feed
                    FeedModel.listItems(data.feed.id, {})
                        .then((contentData) => {
                            this.contentItems = contentData
                        })
                })
        },

        createGroup() {
            return GroupCollection.create(this.instance)
                .then((data) => {
                    this.instance = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        save() {
            if (this.actions.create) {
                this.createGroup().then(this.$nextTick(() => {
                    this.list().then(() => {
                        router.replace('/group/' + this.instance.id + '/manage')
                    })
                }))
            }
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

$light-green: #47d378;
$dark-green: #2b9f67;
$shadow-color: rgba(0, 0, 0, .2);

.group-container {
    display: flex;
    flex-basis: 3;
    section.groups {
        margin: 10px;
        text-align: left;
        flex: 2;
    }
}

.online-circle {
   display: inline-flex;
    height: 16px;
    width: 16px;
    align-self: center;
    border-radius: 50%;
    background: radial-gradient($light-green 50%, $dark-green);
}

.main-form {
    select { margin: 10px 0; }
}

section.sidebar {
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    margin: 10px;
    padding: 20px;
    flex-direction: column;
    justify-content: center;
    border-width: 2px;
    border-style: solid;
    border-color: rgba(52, 73, 94,1.0);
}

.group-info {
    flex: 1;
}
</style>
