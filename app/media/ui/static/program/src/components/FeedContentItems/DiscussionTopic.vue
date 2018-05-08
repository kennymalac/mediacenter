<template>
    <content-item :embed="embedProps" :title="title" :id="id">
        <template slot="title" slot-scope="{ slotProps }">
            <div class="content-title">
                <span class="content-type">Topic</span>
                <a @click="details"> {{ title }}</a>
            </div>
        </template>
        <template slot="embed" slot-scope="{ slotProps }">
            <div class="default-preview topic">
                <blockquote>
                    {{ description }}
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
        id: {
            type: Number
        },
        title: {
            type: String,
            default: ""
        },
        description: {
            type: String,
            default: ""
        },
        owner: {
            type: Number
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
        details() {
            discussions().then((store) => {
                const discussion = store.values.find((item) => {
                    console.log(item)
                    return item.content_item.id === this.id
                })
                console.log(discussion)
                router.replace(`/discussion/` + discussion.id + "/details")
            })
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
