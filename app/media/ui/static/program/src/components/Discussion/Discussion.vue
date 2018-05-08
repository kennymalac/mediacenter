<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <i v-if="instance.icon" :class="instance.icon"></i>
                    </div>
                    <h2>{{ instance.content_item.title }}</h2>
                </div>
            </section>
            
            <section class="posts">
                <p class="contents">{{ instance.text }}</p>
                <h3>Reply</h3>
                <discussion action="create" />
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="title">Title</label>
                    <input class="stack" name="title" v-model="instanceForm.content_item.title" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instanceForm.content_item.description" />

                    <label class="stack" for="text">Contents</label>
                    <textarea class="stack" name="text" v-model="instanceForm.text" />

                    <!-- <label class="stack" for="">Tags</label> -->
                    <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                    <input v-if="actions.create" class="stack" type="submit" value="Create" />
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
import router from "../../router/index.js"
import auth from "../../auth.js"

export default {
    name: 'discussion',
    mixins: [RestfulComponent],
    props: ['feedId'],
    components: {
    },
    computed: {
        discussionLink() {
        }
    },
    data() {
        return {
            objectName: 'discussion',
            instanceForm: {}
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null, content_item: {} }
            this.instanceForm = { content_item: {} }
        },
        
        create() {
        },
        
        details(params) {
            this.list().then(this.$nextTick(() => {
                this.instance = this.objects.find((item) => {
                    return item.id === parseInt(params.id)
                })
            }))
        },

        list(params) {
            return discussions().then((store) => {
                this.objects = store.values
            })
        },
        
        createDiscussion() {
            this.instanceForm.content_item.owner = auth.getActiveUser().details.id
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
                    router.replace('/discussion/' + data.id + '/manage')
                }))
            }
        }
    }
}
</script>

<style lang="scss">
</style>
