<template>
    <div>
        <form class="reply-form" @submit.prevent="$emit('save')">
            <fieldset>
                <label class="stack" for="title">Title</label>
                <input class="stack" name="title" v-model="instanceForm.content_item.title" type="text" />
                <label v-if="!parentId && !instance.parent" class="stack" for="description">Description</label>
                <textarea v-if="!parentId && !instance.parent" class="stack" name="description" v-model="instanceForm.content_item.description" />

                <label class="stack" for="text">Contents</label>
                <textarea v-if="quick" class="stack" name="text" v-model="instanceForm.text" />

                <editor id="tinymce" v-if="!quick" :plugins="[]" :init="editorInit" v-model="instanceForm.text" />

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
// Import TinyMCE
import tinymce from 'tinymce/tinymce'  // eslint-disable-line no-unused-vars

// A theme is also required
import 'tinymce/themes/modern/theme'

// Any plugins you want to use has to be imported
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/print'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/help'
import 'tinymce/plugins/wordcount'

import Editor from '@tinymce/tinymce-vue'

export default {
    name: 'reply',
    components: {
        Editor
    },
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
            editorInit: {
                height: 400,
                plugins: [
                    'advlist autolink lists charmap print preview anchor textcolor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table contextmenu paste code help wordcount'
                ],
                toolbar: 'undo redo |  formatselect | bold italic backcolor charmap  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | table | removeformat',
                skin: 'lightgray',
                menubar: false,
                skin_url: 'static/skins/lightgray',
                branding: false
            }
        }
    }
}
</script>

<style lang="scss">
form.reply-form {
    min-width: 480px;
    width: 100%;
    weight: 100%;
}
</style>
