<template>
    <div class="grid group-container">
        <template v-if="actions.list">
            <action-list :actions="groupActions" />

            <section class="groups" v-if="isLocalGroups">
                <h1>Your Local Groups</h1>
                <group-list :link="localGroupRedirectLink" :items="items" />
                <p v-if="items.length == 0">You are not a member of any local groups, <router-link to="search">discover your location</router-link>.<br />
                    None of the local groups that you join will be visible to users not within your local area (< 100 miles).</p>
                                                                                                                  </section>
            <section class="groups" v-if="!isLocalGroups">
                <h1>Your Groups</h1>
                <group-list :items="items" />
                <p v-if="items.length == 0">You are not a member of any groups, join a group and it will be listed here.</p>
            </section>
        </template>
        <template v-if="actions.details && instance && instance.id">
            <group-info-sidebar v-bind="{ isActiveUserMember, isActiveUserOwner, instance }" @editGroup="editGroup" @joinGroup="joinGroup" @leaveGroup="leaveGroup" @details="viewGroup" :showEdit="true" />
            <div class="group-contents">
                <div v-if="!params.discussionAction && !params.linkAction && !params.imageAction && isActiveUserMember">
                    <content-item-form :stash="resolvedStash" :groupId="instance.id" :feedId="instance.feed.id" :contentTypes="allowedContentTypes" @contentTypeSelected="contentTypeSelected" />
                </div>
                <transition name="view-fade" mode="out-in">
                    <router-view v-if="instance.feed.id" :feedId="instance.feed.id" :showGroupTag="false"></router-view>
                </transition>
            </div>
        </template>
        <template v-if="actions.create || (actions.manage && instance && instance.id)">
            <group-info-sidebar v-bind="{ isActiveUserMember, isActiveUserOwner, instance }" @editGroup="editGroup" @joinGroup="joinGroup" @leaveGroup="leaveGroup"  @details="viewGroup" :showJoin="actions.manage" />
            <form class="main-form" @submit.prevent="save">
                <info-box :preErrorMessage="preErrorMessage" :message="infoBoxMessage" :errorData="infoBoxErrorData" :status="infoBoxStatus" />
                <fieldset>
                    <legend class="stack">Appearance</legend>
                    <label class="stack" for="image">Image</label>
                    <input class="stack" name="image" v-model="instanceForm.image" type="text" />
                </fieldset>
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Name</label>
                    <input class="stack" name="name" v-model="instanceForm.name" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.description" />

                    <label class="stack" for="members">Members</label>
                    <account-select v-model="instanceForm.members" />
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.feed.interests" />

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                </fieldset>
                <fieldset>
                    <legend class="stack">Permissions</legend>
                    <label class="stack">
                        <input v-model="instanceForm.is_restricted" type="checkbox" />
                        <span class="checkable">Invite only</span>
                    </label>
                    <!-- <label class="stack" for="interests">Invite Policy</label> -->
                    <label class="stack" for="visibility">Visibility</label>
                    <visibility-select :required="true" v-model="instanceForm.feed.visibility" />
                    <!-- <label class="stack" for="rules">Rules</label>
                         TODO rules -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
        <template v-if="actions.search">
            <section class="sidebar" style="height: 300px;">
                <form class="search-form">
                    <!-- <restriction-widget :place="place" v-if="isLocalGroups" /> -->
                    <fieldset>
                        <label class="stack" for="interests">Interests</label>
                        <interest-select v-model="filteredInterests" />
                        <button class="stack" type="button" @click="searchGroups">
                            Search
                        </button>
                    </fieldset>
                </form>
            </section>
            <section class="groups" v-if="isLocalGroups">
                <h1>Find Local Groups</h1>
                <group-list :items="filteredObjects" />
                <p v-if="filteredObjects.length == 0">No local groups were found, why not <router-link to="create">create one</router-link>?</p>
            </section>
            <section class="groups" v-if="!isLocalGroups">
                <h1>Find Groups</h1>
                <group-list :items="filteredObjects" />
                <p v-if="filteredObjects.length == 0">No groups were found, why not <router-link to="create">create one</router-link>?</p>
            </section>
        </template>
    </transition>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import {GroupModel} from '../../models/Group.js'
// import {FeedModel} from '../../models/Feed.js'
import {groups, accounts, profiles, interests, activeUser, filteredGroups} from '../../store.js'
import groupDeps from '../../dependencies/Group.js'

import InfoBox from '../Gui/InfoBox'
import GroupInfoSidebar from './GroupInfoSidebar'
import ContentItemForm from '../ContentItemForm'
import AccountSelect from '../AccountSelect'
import InterestSelect from '../InterestSelect'
import RestrictionWidget from '../Place/RestrictionWidget'
import VisibilitySelect from '../Permissions/VisibilitySelect'
import GroupList from './GroupList'
import FeedFilter from '../FeedFilter'
import ActionButton from '../ActionButton'
import ActionList from '../ActionList'
import TagList from '../TagList'

import router from "../../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
        InfoBox,
        GroupInfoSidebar,
        ContentItemForm,
        AccountSelect,
        InterestSelect,
        VisibilitySelect,
        RestrictionWidget,
        GroupList,
        FeedFilter,
        ActionButton,
        ActionList,
        TagList
    },
    props: {
        place: {
            type: Object,
            required: false
        }
    },
    computed: {
        onlineMembers() {
            // TODO
            return this.instance.members
        },
        isLocalGroups() {
            return this.params && this.params.placeId
        },
        items() {
            if (!this.objects.all) {
                return []
            }
            if (this.isLocalGroups) {
                return this.objects.all((group) => {
                    return this.$store.activeUser.details.member_groups.includes(group.id) && group.is_local
                })
            }
            else {
                return this.objects.all((group) => {
                    return this.$store.activeUser.details.member_groups.includes(group.id)
                })
            }
        },
        preErrorMessage() {
            const groupAction = this.action || this.groupAction

            if (!['manage', 'create'].includes(groupAction)) {
                return ""
            }

            return groupAction === 'create' ? "The group could not created" : "The group could not be updated"
        }
    },
    data() {
        return {
            objectName: 'group',
            instance: GroupModel.constructor.initialState,
            instanceForm: { members: [], feed: {} },
            resolvedStash: {},
            filteredInterests: [],
            filteredObjects: [],
            isActiveUserMember: false,
            isActiveUserOwner: true,
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
            // TODO make dynamic
            allowedContentTypes: ['Image', 'Topic', 'Poll', 'Link'],
            contentItems: [],
            infoBoxStatus: "",
            infoBoxMessage: "",
            infoBoxErrorData: {}
        }
    },
    methods: {
        initialState() {
            this.instance = GroupModel.initialState
            this.instanceForm = { members: [], feed: {} }
            this.contentItems = []
            this.infoBoxStatus = ""
            this.infoBoxMessage = ""
            this.infoBoxErrorData = {}
        },

        async contentTypeSelected() {

        },

        localGroupRedirectLink(id) {
            return `/group/${id}/details`
        },

        async create() {
            this.instanceForm = GroupModel.getNewInstance()
            this.instanceForm.feed = { interests: [], content_types: [], visibility: {title: 'Public', value: '0'} }

            const [owner, members, profile, interestCollection, groupCollection] = await Promise.all(
                [activeUser(), accounts(), profiles(), interests(), groups()]
            )
            const ownerAccount = await members.fetchInstance(owner.details.id, {
                groups: groupCollection,
                members,
                profile,
                interests: interestCollection
            })
            this.instanceForm.owner = ownerAccount
            this.instanceForm.feed.owner = ownerAccount

            if (this.isLocalGroups) {
                this.instanceForm.feed.places = [this.place.id]
            }

            if (!this.instanceForm.members.find((member) => {
                return member.id === ownerAccount.id
            })) {
                this.instanceForm.members.push(ownerAccount)
            }
        },

        async manage(params) {
            const user = await activeUser()
            this.isActiveUserMember = user.details.member_groups.includes(parseInt(params.id))

            const groupCollection = await groups()
            this.instance = await this.showInstance(params.id, `/group/${params.id}/details`, groups, await groupDeps())
            await groupCollection.resolve(this.instance)

            this.instanceForm = this.instance.getForm()
        },

        viewGroup() {
            router.push(`/group/${this.instance.id}/details`)
        },

        editGroup() {
            router.push(`/group/${this.instance.id}/manage`)
        },

        async list(params) {
            const groupCollection = await groups()
            await activeUser()

            this.objects = groupCollection.values
        },

        async details(params) {
            const user = await activeUser()
            this.isActiveUserMember = user.details.member_groups.includes(parseInt(params.id))

            const deps = await groupDeps()

            this.instance = await this.showInstance(params.id, '/group/list', groups, deps)

            let stashId = this.params ? this.params.stashId : params.stashId
            if (stashId === undefined || !this.instance.feed.stashes) {
                if (this.instance.feed.id === 0) {
                    const groupCollection = await groups()
                    this.instance = await groupCollection.get(this.instance.id, deps, this.instance)
                }
                stashId = this.instance.feed.stashes[0].id
                router.replace(`details/stash/${stashId}/details`)
            }

            this.resolvedStash = this.instance.feed.stashes.find((stash) => {
                return stash.id === parseInt(stashId)
            })

            this.isActiveUserOwner = this.instance.owner.id === user.details.id

            if (this.instance.feed.instance._isFake) {
                const groupCollection = await groups()
                await groupCollection.get(this.instance.id, deps, this.instance)
            }
        },

        async searchGroups() {
            this.$store.filteredGroups = {}

            const qs = {
                interests: this.filteredInterests
            }
            if (this.isLocalGroups) {
                qs.place = this.place.id
            }

            this.$store.groupFilterParams = qs
            const store = await filteredGroups()
            this.filteredObjects = store.values
        },

        search(params) {

        },

        async manageGroup() {
            const groupCollection = await groups()
            this.instanceForm.feed.name = this.instanceForm.name

            return groupCollection.manage(
                this.instance,
                this.instanceForm,
                await groupDeps()
            )
        },

        async createGroup() {
            const user = await activeUser()

            this.instanceForm.feed.name = this.instanceForm.name
            const groupCollection = await groups()
            return groupCollection.create(this.instanceForm, await groupDeps())
                .then((data) => {
                    user.details.member_groups.push(data.id)
                    return data
                })
        },

        async joinGroup() {
            const user = await activeUser()
            const accountSet = await accounts()
            const newMember = accountSet.values.find((account) => {
                return account.id === user.details.id
            })
            const groupCollection = await groups()
            groupCollection.join(this.instance, newMember)
                .then(() => {
                    user.details.member_groups.push(this.instance.id)
                    this.isActiveUserMember = true
                })
        },

        async leaveGroup() {
            const user = await activeUser()
            const accountSet = await accounts()
            const newMember = accountSet.values.find((account) => {
                return account.id === user.details.id
            })
            const groupCollection = await groups()
            groupCollection.leave(this.instance, newMember)
                .then(() => {
                    user.details.member_groups = user.details.member_groups.filter((groupId) => {
                        return this.instance.id !== groupId
                    })
                    this.isActiveUserMember = false
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageGroup().then(() => {
                    this.infoBoxStatus = "success"
                    this.infoBoxMessage = "Your changes have been saved"
                    router.go(-1)
                })
                    .catch(async (error) => {
                        console.log(error)
                        this.infoBoxStatus = "error"
                        this.infoBoxErrorData = await error.data
                    })
            }
            else if (this.actions.create) {
                this.createGroup().then(data => this.$nextTick(() => {
                    router.replace('/group/' + data.id + '/details')
                }))
                    .catch(async (error) => {
                        console.log(error)
                        this.infoBoxStatus = "error"
                        this.infoBoxErrorData = await error.data
                    })
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
    section.groups {
        text-align: left;
        margin: 10px;
        .group-list {
            overflow-y: scroll;
        }
    }
    grid-template-columns: 1fr 3fr;
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
