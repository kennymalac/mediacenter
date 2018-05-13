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
                    <tag-list :tags="groups" tagType="group" />
                </div>
            </section>
            <!-- <section class="comments"> -->
            <!--     Comments go here... -->
            <!-- </section> -->
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import ProfileList from './ProfileList'
import TagList from '../TagList'

import {profiles} from '../../store.js'

// import {AccountCollection} from '../models/Account.js'
// import {auth} from "../../auth.js"

export default {
    mixins: [RestfulComponent],
    components: {
        ProfileList,
        TagList
    },
    data() {
        return {
            instanceForm: { interests: [] },
            instance: {
                interests: []
            }
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

        async list(params) {
            const store = await profiles()
            this.objects = store.values
        },

        async details(params) {
            this.instance = await this.showInstance(params.id, '/profile/list')
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
