<template>
    <div>
        <template v-if="actions.list && isActiveUserConnected">
            <place-list :items="objects" />
        </template>
        <template v-if="actions.list && !loading && !isActiveUserConnected">
            <div class="alert info">
                This feature requires you to <b>Connect your location</b>
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
        }
    },
    data() {
        return {
            objectName: 'place',
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
        async connect() {
            const placeCollection = await places()
            const deps = await placeDeps()

            navigator.geolocation.getCurrentPosition((position) => {
                console.log('Location: ', position)
                this.instance = placeCollection.connect({ position: geojsonify(position).geometry }, deps)
            }, () => {
                console.log('Location retrieval failure')
            }, this.positionOptions)
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
