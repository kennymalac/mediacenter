<template>
    <div>
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <button @click="showGroups" class="">Local Groups</button>
                    <button @click="showPosts" class="">Local Posts</button>
                </div>
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
                <i class="icon location-icon ion-ios-compass-outline"></i>
                <h1>Find your people.</h1>
                <fieldset>
                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instanceForm.tags_raw" type="text" /> -->
                    <input class="stack" type="submit" value="Connect" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import geojsonify from 'geoposition-to-geojson'

import RestfulComponent from "../RestfulComponent"
import PlaceList from './PlaceList'

import {places, activeUser} from '../../store.js'
import placeDeps from '../../dependencies/Place.js'

export default {
    name: 'place',
    mixins: [RestfulComponent],
    components: {
        PlaceList
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
.connect-location-form {
    i.location-icon {
        font-size: 8rem;
        display: inline-block;
        height: 10px;
    }
}
</style>
