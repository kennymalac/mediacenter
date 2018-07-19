<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <router-view :key="$route.name" :feedId="feedId" :stashId="instance.id"></router-view>
            <section class="feed" v-if="!params.discussionAction && !params.linkAction">
                <feed-content-item-list :stashId="instance.id" :showGroupTag="showGroupTag" :items="content" :enabledContentTypes="enabledContentTypes" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import FeedContentItemList from './FeedContentItemList'
import {stashes, activeUser} from '../store.js'
import stashDeps from '../dependencies/FeedContentStash'

export default {
    name: 'feed-content-stash',
    mixins: [RestfulComponent],
    props: ['feedId', 'showGroupTag'],
    components: {
        FeedContentItemList
    },
    data() {
        return {
            objectName: 'stash',
            instanceForm: { }
        }
    },
    computed: {
        enabledContentTypes() {
            return ["Topic", "Link"]
        },
        content() {
            return this.instance.content
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
            this.instanceForm = { }
        },

        async details(params) {
            this.instance = await this.showInstance(params.id, '/feed/list', stashes, await stashDeps(), this.feedId)
        },

        async list(params) {
            const store = await stashes()

            if (store.values.length === 0) {
                const user = await activeUser()
                // User stashes have not been fetched yet
                await store.list(this.feedId, { owner: user.details.id }, await stashDeps())
            }

            this.objects = store.values
        }
    }
}
</script>

<style lang="scss">
</style>
