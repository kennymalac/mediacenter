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

                    <button type="button" v-if="!isActiveUserMember" @click="joinGroup">Join group</button>
                    <button type="button" v-if="isActiveUserMember" class="warning" @click="leaveGroup">Leave group</button>

                    <div class="who-is-online">
                        <h3><div class="online-circle"></div> {{ onlineMembers.length }} User(s) online now</h3>
                    </div>
                    
                    <tag-list :tags="instance.feed.interests" tagType="interest" />
                </div>
            </section>
            <div class="group-contents">
                <section class="feed">
                    <action-button v-bind="createPostAction" />
                    <feed-content-item-list :items="contentItems" :enabledContentTypes="enabledContentTypes" />
                </section>
            </div>
            <router-view :feedId="instance.feed.id"></router-view>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instanceForm.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.description" />
                    <label class="stack" for="image">Image</label>
                    <input class="stack" name="image" v-model="instanceForm.image" type="text" />
                    <!-- <label class="stack" for="rules">Rules</label>
                         TODO rules -->
                    <label class="stack" for="members">Members</label>
                    <account-select v-model="instanceForm.members" />
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.feed.interests" />
                    
                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
        <template v-if="actions.search">
            <section class="sidebar" style="height: 300px;">
                <form class="search-form">
                    <fieldset>
                        <label class="stack" for="interests">Interests</label>
                        <interest-select v-model="filteredInterests" />
                        <button class="stack" type="button" @click="searchGroups">
                            Search
                        </button>
                    </fieldset>
                </form>
            </section>
            <section class="groups">
                <h1>Find Groups</h1>
                <group-list :items="filteredObjects" />
            </section>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import {GroupCollection, GroupModel} from '../../models/Group.js'
import {FeedModel} from '../../models/Feed.js'
import {groups, accounts, activeUser, filteredGroups} from '../../store.js'

import AccountSelect from '../AccountSelect'
import InterestSelect from '../InterestSelect'
import GroupList from './GroupList'
import FeedContentItemList from '../FeedContentItemList'
import FeedFilter from '../FeedFilter'
import ActionButton from '../ActionButton'
import ActionList from '../ActionList'
import TagList from '../TagList'

import router from "../../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
        AccountSelect,
        InterestSelect,
        GroupList,
        FeedContentItemList,
        FeedFilter,
        ActionButton,
        ActionList,
        TagList
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
            instanceForm: { members: [], feed: {} },
            filteredInterests: [],
            filteredObjects: [],
            isActiveUserMember: false,
            objectName: 'group',
            groupActions: [
                {
                    icon: "ion-ios-people",
                    link: "create",
                    title: "Create a Group",
                    extraIcon: "ion-md-add-circle"
                },
                {
                    link: "search",
                    icon: "ion-md-search",
                    title: "Find a Group"
                }
            ],
            createPostAction: {
                icon: "ion-md-list-box",
                // link: "post",
                link: "details/discussion/create",
                title: "New Post",
                extraIcon: "ion-md-add-circle"
            },
            contentItems: []
        }
    },
    methods: {
        initialState() {
            this.instance = GroupModel.initialState
            this.instanceForm = { members: [], feed: {} }
            this.contentItems = []
        },

        async create() {
            this.instanceForm = GroupModel.getNewInstance()
            this.instanceForm.feed = { interests: [], content_types: [] }

            const owner = await activeUser()
            this.instanceForm.owner = owner.details.id
            this.instanceForm.feed.owner = this.instanceForm.owner
        },

        async manage(params) {
            this.instance = await this.showInstance(params.id, `/group/${params.id}/details`)
            this.instanceForm = this.instance.getForm()
        },

        async list(params) {
            const groupsCollection = await groups()
            this.objects = groupsCollection.values
        },

        async details(params) {
            const user = await activeUser()
            this.isActiveUserMember = user.details.groupforum_set.includes(parseInt(params.id))

            this.instance = await this.showInstance(params.id, '/group/list', GroupCollection, 'groups')
            this.feed = this.instance.feed

            try {
                this.contentItems = await FeedModel.listItems(this.instance.feed.id, {})
            }
            catch (error) {
                console.log(error)
            }
        },

        async searchGroups() {
            this.$store.filteredGroups = {}
            const store = await filteredGroups({
                interests: this.filteredInterests
            })
            this.filteredObjects = store.values
        },

        search(params) {
            
        },

        manageGroup() {
            const {groups, members} = this.$store
            GroupModel.manage(this.instance, this.instanceForm, {...groups.collections, ...members.collections})
                .catch((error) => {
                    console.log(error)
                })
        },

        createGroup() {
            return this.$store.groups.create(this.instanceForm)
                .then((data) => {
                    this.objects.push(data)
                    return data
                })
                .catch((error) => {
                    console.log(error)
                })
        },

        async joinGroup() {
            const user = await activeUser()
            const accountSet = await accounts()
            const newMember = accountSet.values.find((account) => {
                return account.id === user.details.id
            })
            GroupModel.join(this.instance, newMember)
                .then(() => {
                    user.details.groupforum_set.push(this.instance.id)
                    this.isActiveUserMember = true
                })
        },

        async leaveGroup() {
            const user = await activeUser()
            const accountSet = await accounts()
            const newMember = accountSet.values.find((account) => {
                return account.id === user.details.id
            })
            GroupModel.leave(this.instance, newMember)
                .then(() => {
                    user.details.groupforum_set = user.details.groupforum_set.filter((groupId) => {
                        return this.instance.id !== groupId
                    })
                    this.isActiveUserMember = false
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageGroup().then(() => {
                    router.go(-1)
                })
            }
            else if (this.actions.create) {
                this.createGroup().then(data => this.$nextTick(() => {
                    router.replace('/group/' + data.id + '/manage')
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

.main-form, .search-form {
    select { margin: 10px 0; }
}

.search-form {
    width: 300px;
}

section.sidebar {
    display: flex;
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
