<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <router-view :feedId="feedId" :stashId="instance.id"></router-view>

            <section class="feed" v-if="!params.discussionAction">
                <feed-content-item-list :stashId="instance.id" :items="instance.content" :enabledContentTypes="enabledContentTypes" />
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
import {stashes, accounts, feedContentTypes} from '../store.js'

export default {
    name: 'feed-content-stash',
    mixins: [RestfulComponent],
    props: ['feedId'],
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
            return ["Topics"]
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
            this.instanceForm = { }
        },

        async details(params) {
            const [contentTypeCollection, owner] = await Promise.all(
                [feedContentTypes(), accounts()]
            )
            this.instance = await this.showInstance(params.id, '/feed/list', stashes, {
                content_type: contentTypeCollection,
                owner
            }, this.feedId)
        },

        async list(params) {
            const store = await stashes()
            this.objects = store.valuse
        }
    }
}
</script>

<style lang="scss">
</style>
