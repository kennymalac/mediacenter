<template>
    <div :style="profileStyle" :class="profileClass">
        <template v-if="actions.list">
            <div></div>
            <div class="profile-container">
                <h1>User list</h1>
                <profile-list :items="objects" />
            </div>
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
            <div class="profile-container">
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
                <h2>Comments</h2>
                <router-view :profileId="instance.id" />
            </div>
        </template>

        <template v-if="actions.manage && instance.id">
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
            <div class="profile-container">
                <form class="main-form" @submit.prevent="save">
                    <fieldset>
                        <legend class="stack">Appearance</legend>
                        <background-select :colors.sync="colors" />
                        <label class="stack" for="picture">Profile picture (URL)</label>
                        <input class="stack" name="picture" v-model="instanceForm.picture" type="text" />
                    </fieldset>
                    <fieldset>
                        <legend class="stack">Details</legend>
                        <label class="stack" for="name">Display name</label>
                        <input class="stack" name="name" v-model="instanceForm.display_name" type="text" />
                        <label class="stack" for="title">Title</label>
                        <input class="stack" name="title" v-model="instanceForm.title" type="text" />
                        <label class="stack" for="description">Description</label>
                        <textarea class="stack" name="description" v-model="instanceForm.description" />
                        <!-- <label class="stack" for="rules">Rules</label>
                             TODO rules -->
                        <label class="stack" for="interests">Interests</label>
                        <interest-select v-model="instanceForm.interests" />

                        <!-- <label class="stack" for="">Tags</label> -->
                        <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                        <input class="stack" type="submit" value="Save changes" />
                    </fieldset>
                </form>
            </div>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import ProfileList from './ProfileList'
import InterestSelect from '../InterestSelect'
import BackgroundSelect from '../Gui/BackgroundSelect'
import TagList from '../TagList'

// import {ProfileModel} from '../../models/Profile.js'
import profileDeps from '../../dependencies/Profile.js'
import {profiles, activeUser} from '../../store.js'

// import {AccountColelction} from '../models/Account.js'
// import {auth} from "../../auth.js"
import router from "../../router/index.js"

export default {
    name: 'profile',
    mixins: [RestfulComponent],
    components: {
        ProfileList,
        InterestSelect,
        TagList,
        BackgroundSelect
    },
    data() {
        return {
            objectName: 'profile',
            page: 1,
            instanceForm: { interests: [] },
            instance: {
                interests: []
            },
            colors: { hex: "" },
            isActiveUser: false
        }
    },
    computed: {
        profileStyle() {
            if (!this.params ||
                (this.params &&
                 (!(["details", "manage"].includes(this.params.profileAction)) &&
                  !(["details", "manage"].includes(this.params.action))))) {
                return {}
            }
            return {
                "background-color": this.colors.hex
            }
        },
        profileClass() {
            return {
                grid: true,
                "profiles-container": true
            }
        },
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

        async list(params) {
            const profilesCollection = await profiles()
            this.objects = await profilesCollection.list(
                {page: this.page},
                await profileDeps()
            )
        },

        async details(params) {
            if (!this.params.commentAction) {
                router.replace('details/comment/list')
            }

            this.isActiveUser = false
            const deps = await profileDeps()
            this.instance = await this.showInstance(params.id, '/profile/list', profiles, deps)
            this.colors.hex = this.instance.background_color ? `#${this.instance.background_color}` : ""
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

            this.instance = await this.showInstance(params.id, '/profile/list', profiles, await profileDeps())
            this.instanceForm = this.instance.getForm()
        },

        editProfile() {
            router.push(`/profile/${this.instance.id}/manage`)
        },

        async manageProfile() {
            try {
                const profilesCollection = await profiles()
                this.instanceForm.background_color = this.colors.hex.slice(1)
                console.log(this.instanceForm)
                return await profilesCollection.manage(this.instance, this.instanceForm, await profileDeps())
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
@import "~picnic/src/themes/default/_theme.scss";

$dark-green: #2b9f67;

.profiles-container {
    justify-content: center;
    grid-template-columns: 1fr 3fr;
    .comment-container {
        justify-content: center;
    }
}
.profile-container {
    margin: 10px;
    justify-content: center;
    // flex-basis: 3;
    section.feed .feed-list {
        margin: 10px;
        flex: 2;
    }

    .main-form {
        width: 480px;
    }
}

.main-profile {
    width: 100%;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    padding: 20px;
    text-align: left;
}

section.comments {
    margin: auto;
    width: 75%;
}

.category {
    margin: 4px 0;
}
.category-tag {
    display: inline-flex;
    border-radius: 10px;
    margin-right: 4px;
    background: linear-gradient(#35a9e0, rgb(0, 116, 217));
    color: white;
    font-weight: normal;
    padding: 2px 8px;
    font-size: 1rem;
    transition: $picnic-transition;

    &.group-tag {
        background: linear-gradient(#61ad10, $dark-green);
    }
    &:hover, &:focus, &:active {
        cursor: pointer;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
        box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, .35);
    }
    &:active {

    }
}

</style>
