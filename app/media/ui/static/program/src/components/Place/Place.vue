<template>
    <div class="places-container">
        <template v-if="actions.details && instance.id">
            <section class="top-navigation">
                <div @click="showGroups" :class="{ selected: $route.fullPath.includes('group'), xlarge: true }"><i class="ion ion-ios-people"></i> Local Groups</div>
                <div @click="showPosts" :class="{ selected: $route.fullPath.includes('feed'), xlarge: true }" class="xlarge"><i class="ion-ios-filing"></i> Local Content</div>
            </section>
            <div class="place-contents">
                <router-view v-if="instance.default_feed.id" :place="instance.instance" :feedId="instance.default_feed.id"></router-view>
            </div>
        </template>
        <template v-if="actions.list && isActiveUserConnected">
            <place-list :items="objects" />
        </template>
        <template v-if="actions.list && !loading && !isActiveUserConnected">
            <div :class="info" v-html="infoBox.message">
            </div>

            <form class="connect-location-form" @submit.prevent="connect">
                <div class="connect-icon">
                    <compass />
                    <br />
                    <br />
                </div>
                <div class="connect-info">

                    <h1>Find your people.</h1>
                    <fieldset>
                        <!-- <label class="stack" for="">Tags</label> -->
                        <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                        <input class="stack" type="submit" value="Connect" />
                    </fieldset>
                    <small class="courtesy">Image courtesy of <a href="https://www.flickr.com/photos/torley/24777146395">TORLEY</a> (<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC BY-SA 2.0</a>)</small>
                </div>
            </form>
        </template>
    </div>
</template>

<script>
import geojsonify from 'geoposition-to-geojson'

import RestfulComponent from "../RestfulComponent"
import PlaceList from './PlaceList'
import Compass from './Compass'

import {places, activeUser} from '../../store.js'
import placeDeps from '../../dependencies/Place.js'

export default {
    name: 'place',
    mixins: [RestfulComponent],
    components: {
        PlaceList,
        Compass
    },
    props: {
        positionOptions: {
            type: Object,
            default: () => {
                return {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            }
        }
    },
    computed: {
        isActiveUserConnected() {
            return this.instance.id || this.objects.length !== 0
        },
        info() {
            //return Your account was logged in successfully
            //return error, info
            return {
                alert: true,
                hidden: (this.infoBox.message.length < 1),
                error: (this.infoBox.status === "error"),
                info: (this.infoBox.status === "info"),
                success: (this.infoBox.status === "success")
            }
        }
    },
    data() {
        return {
            objectName: 'place',
            instance: { id: null },
            infoBox: {
                status: "info",
                message: "This feature requires you to <b>Connect your location</b>"
            },
            loading: true
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
        },

        async list() {
            const placeCollection = await places()
            const owner = await activeUser()

            this.objects = await placeCollection.getActiveUserPlaces(owner, await placeDeps())
            this.loading = false
        },

        async details(params) {
            const deps = await placeDeps()

            this.instance = await this.showInstance(params.id, '/place/list', places, deps)

            let feedId = this.params.feedId

            // Default to showing the Place's default feed
            if (!this.params.groupAction && feedId === undefined) {
                feedId = this.instance.default_feed.id
                this.$router.replace(`/place/${this.instance.id}/details/feed/${feedId}/details`)
            }
        },

        async connect() {
            const placeCollection = await places()
            const deps = await placeDeps()

            navigator.geolocation.getCurrentPosition(async(position) => {
                console.log('Location: ', position)

                const instance = await placeCollection.connect({ position: geojsonify(position).geometry }, deps).catch(async(error) => {
                    const message = await error.data
                    this.infoBox.status = "error"
                    this.infoBox.message = message.error
                })

                this.objects = [instance]
                this.infoBox.status = "success"
                this.infoBox.message = "Your location has been connected"
            }, () => {
                console.log('Location retrieval failure')
            }, this.positionOptions)
        },

        showGroups() {
            this.$router.push(`/place/${this.instance.id}/details/group/list`)
        },

        showPosts() {
            const feedId = this.instance.default_feed.id
            this.$router.push(`/place/${this.instance.id}/details/feed/${feedId}/details`)
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";
.places-container {
    height: 100%;
    background-image: url("https://flatlanders.net/img/24777146395_0bbfe03661_o.png");
    background-size: cover;
    opacity: .9;
}

.top-navigation {
    div {
        display: inline-block;
        margin: 10px;
        margin-right: 20px;
        border-radius: 0;
        transition: $picnic-transition;
        box-shadow: none;

        &.selected, &:hover, &:focus {
            color: #49637e;
            box-shadow: 0 0.2rem 0 #49637e;
        }
    }
}

.connect-location-form {
    display: flex;
    flex-direction: column;

    .connect-icon {
        i.location-icon {
            font-size: 8rem;
            display: inline-block;
            height: 10px;
        }
    }
    small.courtesy {
        position: absolute;
        top:0;
        right:0;
        bottom:0;
        left:0;
        margin: auto;
        top: 90%;
        text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
        a {
            text-shadow: -1px 0 blue, 0 1px blue, 1px 0 blue, 0 -1px blue;
        }
        mix-blend-mode: difference;
    }
    .connect-info {
        color: white;
        h1 {
            width: 20rem;
            margin: auto;
            //text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;
            //text-shadow: 0.1rem 0.15rem 0.25rem rgba(0,0,0,0.95);
            mix-blend-mode: difference;
        }
    }
    input[type=submit] {
        width: 200px;
        margin: auto;
        border-color: #5126ff !important;
        background: linear-gradient(#666bff 2%, #5126ff 90%, #001f3f);
    }
}
</style>
