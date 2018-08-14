<template>
    <div class="file-upload-component">
        <file-upload :mediaType="mediaType" :uploadQueue="uploadQueue" :requestUpload="request" :isCanceled="isCanceled" @tryUploadFiles="tryUploadFiles" @readyToUpload="readyToUpload" @canceled="canceled" @progress="progress" @failed="failed" @completed="completed" :multiple="false" :uploader="uploader" :chunked="true" />

        <div class="progress-bar-container">
            <div class="progress-bar">
                <div class="progress-value" v-html="progressString"></div>
                <progress max="1" :value="progressVal"></progress>
            </div>
        </div>

        <div class="upload-controls-container">
            <button type="button" @click="cancelUpload" v-if="showUploadBtn" class="btn btn-warning">Cancel</button>
            <button type="button" @click="submitUpload" v-if="showUploadBtn" class="btn btn-primary" :disabled="isUploadBtnDisabled" v-html="uploadBtnText"></button>
        </div>
    </div>
</template>

<script>
/* eslint-disable */
import '../progress-polyfill.js'
import {makeJsonRequest} from '../httputil.js'
import {ImageModel, ImageCollection} from '../models/Image.js'
import {images} from '../store.js'

import linkDeps from '../dependencies/Link.js'

import FileUpload from './FileUpload'

export default {
    name: 'app',
    props: {
        mediaType: String,
        logUploadUri: {
            type: String,
            required: false
        },
        stashId: Number,
        uploader: Object,
        // TODO contentForm should support multiple image uploads
        contentForm: {
            type: Object,
            default: () => {}
        },
        instance: {
            type: Object,
            required: false
        },
        multiple: {
            type: Boolean,
            default: false
        }
    },
    components: {
        FileUpload
    },
    data() {
        return {
            instances: new Map(),
            contentCollection: null,
            progressVal: 0,
            progressString: 'select a file',
            fileIsReady: false,
            showUploadBtn: false,
            isUploadBtnDisabled: false,
            uploadBtnText: 'Upload',
            // WARNING/NOTE: only supports one file at a time as of now
            unprocessedFileIds: [],
            uploadQueue: [],
            isCanceled: false
        }
    },
    async mounted() {
        switch (this.mediaType) {
        case "image":
            this.contentCollection = await images()
        }
    },
    methods: {
        logMessage(data) {
            console.log('logMessage: ', data)
            if (this.mediaType !== 'video') {
                return
            }

            return fetch(this.logUploadUri, {
                method: "POST",
                mode: 'same-origin',
                credentials: 'include',
                headers: new Headers({
                    "Content-Type": "application/json"
                }),
                body: JSON.stringify(Object.assign({}, data, {
                }))
            })
                .then((response) => {
                    if (response.status >= 200 && response.status < 300) {
                        // ok
                    } else {
                        var error = new Error(response.statusText)
                        error.response = response
                        throw error
                    }
                })
        },
        logError(message) {
            this.logMessage({
                errors: true,
                error: message
            })
        },
        unloaded(e) {
            // Custom text not supported as of Chrome 51, Firefox 44...
            const text = 'Do you really want to close? Your file is still uploading.'
            e.returnValue = text
            return text
        },
        canceled(ids, showMessage = true) {
            if (showMessage) {
                this.progressString = 'canceling&hellip;'
            }
            this.progressVal = 0
            this.uploadBtnText = 'Upload'
            this.isUploadBtnDisabled = false
            this.showUploadBtn = false
            window.removeEventListener('beforeunload', this.unloaded)

            // .then((data) => {
            //     if (showMessage) {
            //         this.progressString = 'upload canceled'
            //     }
            // })
            // .catch(() => {
            //     this.progressString = 'something went wrong'
            // })
        },
        cancelUpload() {
            this.isCanceled = true
        },
        submitUpload() {
            // NOTE will only upload single file
            // Appending to the queue's items with the item id
            this.isCanceled = false
            this.uploadQueue = [this.unprocessedFileIds.pop()]
            this.uploadBtnText = 'Uploading&hellip;'
            this.isUploadBtnDisabled = true
        },
        readyToUpload(id) {
            this.unprocessedFileIds = [id]
            this.progressString = 'file selected'
            this.showUploadBtn = true
            window.addEventListener('beforeunload', this.unloaded)
        },
        tryUploadFiles(promise) {
            promise.then(() => {
                // Reset the queue
                this.uploadQueue = []
            })
        },
        async request(fileName) {
            console.log('requesting: ', fileName)
            if (!this.multiple) {
                // TODO AUTH TOKEN
                return { id: this.instance.id, name: fileName }
            }

            try {
                const instance = await this.contentCollection.create(this.contentForm, await linkDeps(this.stashId))
                this.instances.set(instance.id, instance)
                // TODO AUTH TOKEN
                return { id: instance.id, name: fileName }
            }
            catch (e) {
                this.logError(e)
            }
        },
        async finish(id, fullFilePath) {
            window.removeEventListener('beforeunload', this.unloaded)
            console.log(`finished upload: ${id} ${fullFilePath}`)

            const instance = this.multiple ? this.instances.get(id) : this.instance
            this.contentCollection.manage(instance, {
                ...this.contentForm,
                src: fullFilePath
            }, await linkDeps(this.stashId))
                .then((data) => {
                    if (data.ready) {
                        this.fileIsReady = true
                    }
                    else {
                        this.fileIsReady = false
                        // Let the user know their file is still processing
                        // this.showProcessingMessage = true
                    }
                    this.progressString = 'finished'
                    this.showUploadBtn = false
                    this.isUploadBtnDisabled = false
                    this.uploadBtnText = 'Upload'

                    this.$emit('uploaded', fullFilePath)

                    const loggingMessage = this.logMessage({ errors: false })
                })
        },
        progress(val) {
            if (val === 0 || val === 1) {
                this.progressVal = parseFloat(val).toFixed(2)
            }
            else {
                this.progressVal = parseFloat(val)
            }
            this.progressString = Math.floor(this.progressVal * 100).toString() + '%'
        },
        completed(id, fullFilePath) {
            this.progressString = 'please wait&hellip;'
            this.finish(id, fullFilePath)
        },
        failed(reason) {
            this.progressString = 'upload failed!'
            this.logError(reason)
        }
    }
}
</script>

<style src="../progress-polyfill.css">
</style>

<style lang="scss">
.file-upload-component {
    min-height: 120px;

    input[type=file] {
        margin: auto;
    }

    .upload-controls-container {
        padding-top: 10px;
        width: 140px;
        margin: auto;
        display: flex;
        justify-content: center;
    }

    .progress-bar-container {
        display: flex;
        justify-content: center;
        height: 28px;
        margin: 10px 0;
    }

    button {
        margin: auto;
        display: flex;
        justify-content: center;
    }

    .progress-bar {
        margin: auto;
        width: 80%;
        height: 28px;
        display: flex;
        justify-content: center;

        .progress-value {
            user-select: none;
            align-self: center;
            color: #eee;
            font-family: sans;
            font-size: 14px;
            position: absolute;
            display: inline-flex;
        }
    }

    progress[value]::-webkit-progress-bar {
        background-color: #ccc;
        border-radius: 2px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }
    progress[value]::-moz-progress-bar {
        background-image:
            linear-gradient(-45deg,
                            transparent 33%, rgba(0, 0, 0, .1) 33%,
                            rgba(0,0, 0, .1) 66%, transparent 66%),
            linear-gradient(top,
                            rgba(255, 255, 255, .25),
                            rgba(0, 0, 0, .25)),
            linear-gradient(left, #09c, #f44);

        background-image:
            -webkit-linear-gradient(top,
                                    rgba(0,172,238, .45),
                                    rgba(32,57,141, .45)),
            -webkit-linear-gradient(left, #09c, rgb(48,68,157));

        border-radius: 2px;
        background-size: 35px 28px, 100% 100%, 100% 100%;
    }
    /* Polyfill */
    progress[aria-valuenow]:before {
        background-color: #ccc;
        border-radius: 2px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
    }

    progress[value] {
        /* Reset the default appearance */
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;

        /* Get rid of default border in Firefox. */
        border: none;

        /* Dimensions */
        width: 100%;
        height: 100%;

        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) inset;
        background-color: #ccc;
        border-radius: 2px;
    }

    progress[value]::-webkit-progress-value {
        background-image:
            linear-gradient(-45deg,
                            transparent 33%, rgba(0, 0, 0, .1) 33%,
                            rgba(0,0, 0, .1) 66%, transparent 66%),
            linear-gradient(top,
                            rgba(255, 255, 255, .25),
                            rgba(0, 0, 0, .25)),
      linear-gradient(left, #09c, #f44);

    background-image:
      -webkit-linear-gradient(top,
        rgba(0,172,238, .45),
        rgba(32,57,141, .45)),
      -webkit-linear-gradient(left, #09c, rgb(48,68,157));

    border-radius: 2px;
    background-size: 35px 28px, 100% 100%, 100% 100%;
  }
}
</style>
