<template>
    <div class="feed-container">
        <template v-if="actions.list">
            <h1>User list</h1>
            <profile-list :items="objects" />
        </template>

        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <img v-if="instance.picture" :src="instance.picture" />
                        <i v-if="!instance.picture" class="ion-md-person"></i>
                    </div>
                    <h2>{{ instance.display_name }}</h2>

                    <button type="button" v-if="isActiveUser" @click="editProfile">
                        <i class="ion-md-create"></i> Edit
                    </button>
                </div>
            </section>
            <section class="main-profile">
                <h2>{{ instance.title }}</h2>
                <p class="description">{{ instance.description }}</p>

                <div class="category">
                    <span>Interests:</span>
                    <tag-list :tags="instance.interests" tagType="interest" />
                </div>
                <div class="category">
                    <span>Groups:</span>
                    <tag-list :tags="instance.account.member_groups" tagType="group" />
                </div>
            </section>
            <!-- <section class="comments"> -->
            <!--     Comments go here... -->
            <!-- </section> -->
        </template>

        <template v-if="actions.manage && instance.id">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="name">Display name</label>
                    <input class="stack" name="name" v-model="instanceForm.display_name" type="text" />
                    <label class="stack" for="title">Title</label>
                    <input class="stack" name="title" v-model="instanceForm.title" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.description" />
                    <label class="stack" for="picture">Profile picture</label>
                    <input class="stack" name="picture" v-model="instanceForm.picture" type="text" />
                    <!-- <label class="stack" for="rules">Rules</label>
                         TODO rules -->
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.interests" />

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                    <input class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import ProfileList from './ProfileList'
import InterestSelect from '../InterestSelect'
import TagList from '../TagList'

import {ProfileModel} from '../../models/Profile.js'
import {profiles, accounts, groups, activeUser, interests} from '../../store.js'

// import {AccountCollection} from '../models/Account.js'
// import {auth} from "../../auth.js"
import router from "../../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
        ProfileList,
        InterestSelect,
        TagList
    },
    data() {
        return {
            page: 1,
            instanceForm: { interests: [] },
            instance: {
                interests: []
            },
            isActiveUser: false
        }
    },
    computed: {
        groups() {
            if (this.instance.id) {
                //
            }
            return []
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, interests: [] }
            this.instanceForm = { interests: [] }
        },

        async dependencies() {
            const [interestCollection, account, groupCollection] = await Promise.all(
                [interests(), accounts(), groups()]
            )

            return {
                interests: interestCollection,
                account,
                member_groups: groupCollection
            }
        },

        async list(params) {
            const profilesCollection = await profiles()
            this.objects = await profilesCollection.list(
                {page: this.page},
                await this.dependencies()
            )
        },

        async details(params) {
            this.isActiveUser = false
            const deps = await this.dependencies()
            this.instance = await this.showInstance(params.id, '/profile/list', profiles, deps)

            // check if certain profile information is missing
            if (!this.instance.title) {
                const profilesCollection = await profiles()
                await profilesCollection.get(this.instance.id, deps, this.instance)
            }
            const user = await activeUser()
            this.isActiveUser = this.instance.id === user.details.profile.id
        },

        async manage(params) {
            if (!this.isActiveUser) {
                return
            }

            this.instance = await this.showInstance(params.id, '/profile/list', profiles, await this.dependencies())
            this.instanceForm = this.instance.getForm()
        },

        editProfile() {
            router.push(`/profile/${this.instance.id}/manage`)
        },

        async manageProfile() {
            try {
                return await ProfileModel.manage(this.instance, this.instanceForm, await this.dependencies())
            }
            catch (error) {
                console.log(error)
            }
        },

        save() {
            if (this.actions.manage) {
                this.manageProfile().then(() => {
                    router.push(`/profile/${this.instanceForm.id}/details`)
                })
            }
        }
    }
}
</script>

<style lang="scss">
$dark-green: #2b9f67;

.main-profile {
    min-width: 500px;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    padding: 20px;
    text-align: left;
}
.category {
    margin: 4px 0;
}
.category-tag {
    display: inline-flex;
    border-radius: 10px;
    margin-right: 4px;
    background-color: #1F8DD6;
    color: white;
    font-weight: normal;
    padding: 2px 8px;
    font-size: 1rem;
    &.group-tag {
        background-color: $dark-green;
    }
    &:hover, &:focus {
        cursor: pointer;
    }
    &:active {
        box-shadow: 0 1px 1px 0px rgba(0, 0, 0, .3);
    }
}

</style>
