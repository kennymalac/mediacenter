<template>
    <transition name="slide-fade">
        <form :class="replyClass" v-if="show" @submit.prevent="$emit('save')">
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
                <div v-if="!parentId">
                    <label class="stack" for="interests">Interests</label>
                    <interest-select v-model="instanceForm.content_item.interests" />
                </div>

                <label class="stack">
                    <input v-model="instanceForm.content_item.is_anonymous" name="is_anonymous" type="checkbox">
                    <span class="checkable">Post Anonymously</span>
                </label>

                <div style="display: flex;">
                    <button class="stack error" type="button" @click="$emit('canceled')"><i class="ion-ios-undo"></i> Cancel</button>

                    <input v-if="replyBtnText" class="stack" type="submit" :value="replyBtnText" />
                    <input v-if="!replyBtnText && action === 'create' && !parentId" class="stack" type="submit" value="Create" />
                    <input v-if="!replyBtnText && action === 'create' && parentId" class="stack" type="submit" value="Reply" />
                    <input v-if="!replyBtnText && action === 'manage'" class="stack" type="submit" value="Save changes" />
                </div>
            </fieldset>
        </form>
    </transition>
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
import InterestSelect from '../InterestSelect'

export default {
    name: 'reply',
    components: {
        Editor,
        InterestSelect
    },
    props: {
        show: {
            type: Boolean,
            default: true
        },
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
        },
        replyBtnText: {
            type: String,
            required: false
        }
    },
    computed: {
        replyClass() {
            return {
                "reply-form": true,
                "quick-reply": this.quick,
                hidden: !this.show
            }
        }
    },
    data() {
        return {
            editorInit: {
                height: 400,
                plugins: [
                    'advlist autolink lists charmap print preview anchor textcolor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media image table contextmenu paste code help wordcount'
                ],
                toolbar: 'undo redo |  formatselect | bold italic backcolor charmap  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | image table | removeformat',
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
@import "~picnic/src/themes/default/_theme.scss";
form.reply-form {
    min-width: 480px;
    width: 100%;
    weight: 100%;
    button.stack.error {
        text-align: center;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: .2em;
    }
    input[type=submit] {
        border-bottom-left-radius: 0;
        border-top-left-radius: 0;
        border-bottom-right-radius: .2em;
    }
}

.slide-fade-enter-active {
    transition: all .3s ease;
}
.slide-fade-leave-active {
    transition: all .3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
   opacity: 0;
}
</style>
