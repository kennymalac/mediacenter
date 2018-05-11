<template>
    <content-item :embed="embedProps" v-bind="item.instance">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <span class="content-type">Topic</span>
                <a @click="details"> {{ item.title }}</a>
            </div>
            <span class="date">{{ item.created.fromNow() }}</span>
        </template>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview topic">
                <blockquote>
                    {{ item.description }}
                </blockquote>
            </div>
        </template>
    </content-item>
</template>

<script>
import ContentItem from './ContentItem'
import {discussions} from "../../store.js"
import router from "../../router/index.js"

export default {
    name: 'feed-discussion-topic',
    props: {
        item: {
            type: Object
        }
    },
    components: {
        ContentItem
    },
    data() {
        return {
            embedProps: {
                src: null
            }
        }
    },
    methods: {
        async details() {
            const store = await discussions()
            const discussion = store.values.find((item) => {
                console.log(item)
                return item.content_item.id === this.item.id
            })
            console.log(discussion)
            router.push(`/discussion/` + discussion.id + "/details")
        }
    }
}
</script>

<style scoped lang="scss">
.content-title {
    .content-type {
        display: inline-flex;
        border-radius: 6px;
        background-color: #1F8DD6;
        color: white;
        font-weight: normal;
        padding: 4px;
        font-size: 1rem;
    }
}

.topic {
    quote {
        font-style: oblique;
        overflow: hidden;
    }
}
</style>
