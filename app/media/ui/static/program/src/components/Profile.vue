<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <i v-if="instance.icon" :class="instance.icon"></i>
                    </div>
                    <h2>{{ instance.first_name }} {{ instance.last_name }}</h2>
                </div>
            </section>
            <section class="main-profile">
                <h2>{{ instance.profile.title }}</h2>
                <p class="description">{{ instance.profile.description }}</p>
                
                <div class="category">
                    <span>Interests:</span> <span v-for="interest in interests" class="category-tag">{{ interest.name }}</span>
                </div>
                <div class="category">
                    <span>Groups:</span> <span v-for="group in groups" class="category-tag group-tag" @click="clickGroupTag(group.id)">{{ group.name }}</span>
                </div>
            </section>
            <!-- <section class="comments"> -->
            <!--     Comments go here... -->
            <!-- </section> -->
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import router from "../router/index.js"
// import {AccountCollection} from '../models/Account.js'
// import {auth} from "../../auth.js"

export default {
    mixins: [RestfulComponent],
    data() {
        return {
            instance: {
                id: 1,
                icon: "ion-md-person",
                profile: {
                    title: "Welcome to my profile!",
                    description: "I like this this this this , etc."
                },
                first_name: "King",
                last_name: "Herring"
            },
            interests: [
                {
                    name: "Programming"
                },
                {
                    name: "Reading"
                },
                {
                    name: "Philosophy"
                }
            ],
            groups: [
                {
                    id: 4,
                    name: "Tea"
                },
                {
                    id: 5,
                    name: "Philosophers"
                }
            ]
        }
    },
    methods: {
        initialState() {
            
        },

        clickGroupTag(groupId) {
            router.push(`/group/${groupId}/details`)
        },

        details(params) {
            
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
