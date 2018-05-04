<template>
    <div class="feed-container">
        <template v-if="actions.details && instance.id">
            <section class="sidebar">
                <div class="group-info">
                    <div class="icon-container">
                        <i v-if="instance.icon" :class="instance.icon"></i>
                    </div>
                    <h2>{{ instance.title }}</h2>
                    <p class="description">{{ instance.description }}</p>
                </div>
            </section>
            
            <section class="posts">
                No posts here
            </section>
        </template>
        <template v-if="actions.create || actions.manage">
            <form class="main-form" @submit.prevent="save">
                <fieldset>
                    <legend class="stack">Details</legend>
                    <label class="stack" for="title">Title</label>
                    <input class="stack" name="title" v-model="instance.title" type="text" />
                    <label class="stack" for="description">Description</label>
                    <textarea class="stack" name="description" v-model="instance.description" />

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
import {DiscussionCollection} from "../../models/Discussion.js"
import router from "../../router/index.js"

export default {
    mixins: [RestfulComponent],
    components: {
    },
    computed: {
        discussionLink() {
        }
    },
    data() {
        return {
            objectName: 'discussion',
            objects: [
                {
                    id: 1,
                    title: "I like salads",
                    order: "",
                    description: "Discuss."
                }
            ]
        }
    },
    methods: {
        initialState() {
            this.instance = { id: null }
            this.contentItems = []
        },
        
        create() {
            this.instance = { content_types: [] }
        },
        
        details(params) {
            this.instance = this.objects.find((item) => {
                return item.id === parseInt(params.id)
            })
            DiscussionCollection.get(this.instance.id)
                .then((data) => {
                    this.instance = data
                })
        },
        
        createDiscussion() {
            return DiscussionCollection.create({
                name: this.instance.name,
                description: this.instance.description
            })
                .then((data) => {
                    this.instance = data
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        
        save() {
            if (this.actions.create) {
                this.createDiscussion().then(this.$nextTick(() => {
                    router.replace('/discussion/' + this.instance.id + '/manage')
                }))
            }
        }
    }
}
</script>

<style lang="scss">
</style>
