<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <section class="posts">

                <post v-bind="instance.instance" />
                <post v-for="post in posts" v-bind="post.instance" />

                <h3>Quick Reply</h3>
                <discussion :feedId="getFeedId" :parentId="instance.id" :parentTitle="instance.content_item.title" action="create" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <label class="stack" for="title">Title</label>
                    <input class="stack" name="title" v-model="instanceForm.content_item.title" type="text" />
                    <label v-if="!parentId" class="stack" for="description">Description</label>
                    <textarea v-if="!parentId" class="stack" name="description" v-model="instanceForm.content_item.description" />

                    <label class="stack" for="text">Contents</label>
                    <textarea class="stack" name="text" v-model="instanceForm.text" />

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                    <input v-if="actions.create && !parentId" class="stack" type="submit" value="Create" />
                    <input v-if="actions.create && parentId" class="stack" type="submit" value="Reply" />
                    <input v-if="actions.manage" class="stack" type="submit" value="Save changes" />
                </fieldset>
            </form>
        </template>
    </div>

</template>

<script>
import RestfulComponent from "../RestfulComponent"
import {discussions} from "../../store.js"
import {DiscussionCollection} from "../../models/Discussion.js"
import Post from './Post'

import router from "../../router/index.js"
import auth from "../../auth.js"

export default {
    name: 'discussion',
    mixins: [RestfulComponent],
    props: ['feedId', 'parentId', 'parentTitle'],
    components: {
        Post
    },
    computed: {
        discussionLink() {
        },
        posts() {
            return this.objects.filter((item) => {
                return item.parent === this.instance.id
            })
        },
        getFeedId() {
            return this.instance.content_item.feeds[0]
        }
    },
    data() {
        return {
            objectName: 'discussion',
            instanceForm: { content_item: {} }
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: { feeds: [] } }
            this.instanceForm = { content_item: {} }
        },
        
        create() {
            this.list()
            if (this.parentTitle) {
                this.instanceForm.content_item.title = `Re: ${this.parentTitle}`
            }
        },
        
        details(params) {
            this.showInstance(params.id, 'feed/list', (instance) => {
                this.instance = instance
            })
        },

        list(params) {
            return discussions().then((store) => {
                this.objects = store.values
            })
        },
        
        createDiscussion() {
            this.instanceForm.content_item.owner = auth.getActiveUser().details.id
            if (this.parentId) {
                this.instanceForm.parent = this.parentId
            }
            this.instanceForm.content_item.feeds = [this.feedId]

            return DiscussionCollection.create(this.instanceForm)
                .then((instance) => {
                    this.objects.push(instance)
                    return instance
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        
        save() {
            if (this.actions.create) {
                this.createDiscussion().then(data => this.$nextTick(() => {
                    if (!this.parentId) {
                        router.replace('/discussion/' + data.id + '/details')
                    }
                }))
            }
        }
    }
}
</script>

<style lang="scss">
    textarea {
    min-height: 200px;
}
</style>
