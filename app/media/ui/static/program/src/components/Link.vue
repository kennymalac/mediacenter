<template>
    <div class="link-container">
        <template v-if="actions.details && instance.id">

        </template>
        <template v-if="actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <label class="stack" for="title">Title</label>
                    <input v-model="instanceForm.content_item.title" type="text" name="title" placeholder="Link title" />
                    <label class="stack" for="link">Link</label>
                    <input v-model="instanceForm.link" type="text" name="link" placeholder="https://example.com" />

                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.content_item.interests" />

                    <input type="submit" class="stack" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>
</template>

<script>
import RestfulComponent from "./RestfulComponent"
import {links} from '../store.js'
import {LinkModel} from '../models/Link.js'
import linkDeps from '../dependencies/Link.js'

import InterestSelect from './InterestSelect'

import router from "../router/index.js"

export default {
    name: 'hyperlink',
    mixins: [RestfulComponent],
    props: ['stashId', 'feedId'],
    components: {
        InterestSelect
    },
    data() {
        return {
            objectName: 'link',
            instanceForm: { content_item: {} }
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: { interests: [] } }
        },

        showUserProfile(id) {
            router.push(`/profile/${id}/details`)
        },

        async manage(params) {
            const fallthrough = this.parentId ? `/link/${this.parentId}/detail` : `/feed/list`

            this.instance = await this.showInstance(params.id, fallthrough, links, await linkDeps(this.stashId))
            this.instanceForm = this.instance.getForm()
        },

        async details(params) {
            this.instance = await this.showInstance(params.id, '/feed/list', links, await linkDeps(this.stashId))
        },

        async manageLink() {
            return LinkModel.manage(this.instance, this.instanceForm, await linkDeps(this.stashId))
                .catch((error) => {
                    console.log(error)
                })
        },

        save() {
            if (this.actions.manage) {
                this.manageLink().then(() => {
                    //router.go(`../link/${this.instance.id}/details`)
                })
            }
        }
    }
}
</script>

<style lang="scss">
</style>
