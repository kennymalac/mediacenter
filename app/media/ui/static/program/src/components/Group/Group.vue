<template>
    <div class="group-container">
        <template v-if="actions.list">
            <div class="action-list">
                <div class="action-button">
                    <div class="icon-container">
                        <i class="ion-ios-people"></i>
                    </div>
                    <h2><i class="ion-md-add-circle"></i> Create a Group</h2>
                </div>
                <div class="action-button">
                    <div class="icon-container">
                        <i class="ion-md-search"></i>
                    </div>
                    <h2>Find a Group</h2>
                </div>
            </div>
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
                <feed-image item="{}" />
                <feed-image item="{}" />
                <feed-image item="{}" />
                <feed-image item="{}" />
            </div>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "../RestfulComponent"
import GroupList from './GroupList'
import FeedImage from '../FeedItems/Image'

export default {
    mixins: [RestfulComponent],
    components: {
        GroupList,
        FeedImage
    },
    data() {
        return {
            instance: { id: null },
            objects: [
                {
                    id: 1,
                    name: "Tea Lovers",
                    description: "A place for teaheads.",
                    rules: [
                        "No spam",
                        "Coffee is evil!"
                    ],
                    members: [
                        {}
                    ],
                    image: "https://www.sciencemediacentre.co.nz/wp-content/upload/2009/03/tea.jpg"
                },
                {
                    id: 2,
                    name: "Philosophy",
                    rules: [],
                    members: [
                    ],
                    image: "https://c1.staticflickr.com/5/4101/4870567608_69fbf87121_b.jpg"
                }
            ]
        }
    },
    computed: {
        onlineMembers() {
            // TODO
            return this.instance.members
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
        },

        create() {
            // TODO
        },

        details(params) {
            this.instance = this.objects.find((item) => {
                return item.id === parseInt(params.id)
            })
        },

        list() {
            // TODO
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

.action-list {
    display: flex;
    flex-direction: column;
}

.group-info {
    flex: 1;
}

.icon-container {
    background: linear-gradient(150deg, white, rgba(0, 31, 63, 0.2));
    display: inline-flex;
    width: 140px;
    height: 140px;
    align-items: center;
    justify-content: center;
    i {
        font-size: 6rem;
    }
    img {
        transition: $picnic-transition;
        border-radius: 50%;
    }
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 50%;
    transition: $picnic-transition;

    box-shadow: 0 3px 8px 0px $shadow-color;
}
.action-button {
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    margin: 10px;
    padding: 20px;
    h2 i {
        color: $light-green;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    
    width: 400px;
    border-width: 2px;
    border-color: $dark-green;
    border-style: solid;
    border-radius: 6px;
    
    transition: $picnic-transition;
    
    &:hover, &:focus {
        box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.35);
        .icon-container {
            opacity: .9;
        }
        cursor: pointer;
    }
    &:active {
        box-shadow: inset 0 0 0 99em rgba(52, 73, 94, 0.02);
        border-style: inset;
        .icon-container {
            opacity: .8;
            border-style: inset;
            img {
                opacity: .8;
            }
        }
    }
}
</style>
