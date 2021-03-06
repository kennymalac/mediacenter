<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <transition name="view-fade" mode="out-in">
                <router-view :key="$route.name" :feedId="feedId" :stashId="instance.id"></router-view>
            </transition>
            <section class="feed" v-if="!params.discussionAction && !params.linkAction && !params.imageAction">
                <feed-content-item-list :showMenu="showMenu" @listChildren="listContentChildren" @togglePin="togglePin" :stashId="instance.id" :query="query" :showGroupTag="showGroupTag" :items="content" :enabledContentTypes="enabledContentTypes" />
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
// import PaginatedComponent from "./PaginatedComponent"

import FeedContentItemList from './FeedContentItemList'
import {stashes, activeUser} from '../store.js'
import {FeedContentStashModel} from '../models/FeedContentStash.js'
import stashDeps from '../dependencies/FeedContentStash'

//import PaginationControls from './PaginationControls'

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
            instanceForm: { },
            content: { results: [] },
            order: "-updated",
            showMenu: false,
            currentPage: 1
        }
    },
    computed: {
        enabledContentTypes() {
            return ["Topic", "Poll", "Link", "Image"]
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
            this.instanceForm = { }
        },

        async togglePin(item) {
            this.instance.collections.content.togglePin(
                this.content.results.find((instance) => { return instance.item.id === item.id }), this.instance.id, await stashDeps())
        },

        async listContentChildren(currentPage, _deps = null) {
            this.currentPage = currentPage || this.currentPage
            const deps = _deps || {...await stashDeps(), stashes: this.$store.stashes}

            const resp = await FeedContentStashModel.listContent(
                this.instance,
                this.feedId,
                {page: this.currentPage, order: this.order},
                deps,
                this.content.length)
            this.content = resp
        },

        async details(params) {
            const deps = await stashDeps()
            this.instance = await this.showInstance(params.id, '/feed/list', stashes, deps, this.feedId)

            // const user = await activeUser()
            // TODO only show for owners/moderators
            this.showMenu = true

            this.observers$.push(this.$store.$observe('feedContentItemListSortingOption', (val) => {
                if (val) {
                    this.order = val
                    this.listContentChildren(this.query.page, {...deps, stashes: this.$store.stashes})
                }
            }, 'order'))
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
