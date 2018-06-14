<template>
    <div>
        <form class="main-form" @submit.prevent="$emit('save')">
            <fieldset>
                <label class="stack" for="title">Title</label>
                <input class="stack" name="title" v-model="instanceForm.content_item.title" type="text" />
                <label v-if="!parentId && !instance.parent" class="stack" for="description">Description</label>
                <textarea v-if="!parentId && !instance.parent" class="stack" name="description" v-model="instanceForm.content_item.description" />

                <label class="stack" for="text">Contents</label>
                <textarea class="stack" name="text" v-model="instanceForm.text" />

                <!-- <label class="stack" for="">Tags</label> -->
                <!-- <input class="stack" name="tags" v-model="instance.tags_raw" type="text" /> -->
                <input v-if="action === 'create' && !parentId" class="stack" type="submit" value="Create" />
                <input v-if="action === 'create' && parentId" class="stack" type="submit" value="Reply" />
                <input v-if="action === 'manage'" class="stack" type="submit" value="Save changes" />
            </fieldset>
        </form>
    </div>
</template>

<script>
export default {
    name: 'reply',
    props: {
        active: {
            type: Boolean,
            default: false
        },
        quick: {
            type: Boolean,
            default: true
        },
        action: {
            type: String
        },
        instance: {
            type: Object
        },
        instanceForm: {
            type: Object
        },
        parentId: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss">
</style>
