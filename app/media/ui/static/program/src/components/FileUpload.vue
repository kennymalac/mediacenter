<template>
    <div>
        <input v-if="multiple" @change="uploadMediaItems" type="file" multiple />
        <input @change="uploadMediaItems" type="file" />
    </div>
</template>

<script>
/* eslint-disable */

export default {
    name: "file-upload",
    props: ["uploadQueue", "requestUpload", "multiple", "chunked", "uploader", "isCanceled", "mediaType"],
    data() {
        return {
            filesUploading: new Map(),
            fileStore: new Map()
        }
    },

    watch: {
        isCanceled(val) {
            if (val == true) {
                this.cancelUpload()
            }
        },
        uploadQueue(val) {
            if (val.length == 0) {
                // The queue was reset
                return
            }

            this.$emit('tryUploadFiles', new Promise((resolve, reject) => {
                for (const id of val) {
                    if (this.filesUploading.has(id)) {
                        // File is already processing
                        continue
                    }
                    // This file is now uploading, ignore it if the queue is updated again
                    const stored = this.fileStore.get(id)
                    this.filesUploading.set(id, stored.name)
                    // assemble full uploader config and process it
                    // NOTE this promise could return a list of Promises of the uploads with success and fail,
                    // but that can be added later when multiple files becomes a feature
                    this.doUpload(id, stored)
                }
                // for now just return the "queue"
                resolve(val)
            }))
        }
    },

    methods: {
        cancelUpload(showMessage = true) {
            if (this.filesUploading.size == 0) {
                // The user has not started the upload but still wants to cancel it
                this.$emit('canceled', Array.from(this.fileStore.keys()), showMessage)
                this.fileStore.clear()
            }
            this.uploader.cancel().then(() => {
                this.$emit('canceled', Array.from(this.filesUploading.keys()))
                this.filesUploading.clear()
            })
        },
        doUpload(id, storedFile) {
            this.uploader.add(storedFile, (val) => { this.$emit('progress', val) })
            // The file has been fully uploaded, send the completed event
                .then(uri => this.$emit('completed', id, uri),
                      reason => this.$emit('failed', reason))
                .then(() => {
                    this.fileStore.delete(id)
                    this.filesUploading.delete(id)
                })
        },
        uploadMediaItems(e) {
            var files = e.target.files || e.dataTransfer.files

            if (!files.length) {
                return
            }
            // TODO multiple uploads
            if (this.fileStore.size !== 0)
                this.cancelUpload(false)

            if (this.uploader) {
                // TODO support uploading more than one video?
                const file = files[0]
                let fileName = file.name

                if (this.mediaType == 'video') {
                    // m3u8 will break with spaces in video filename (hls.js #1439) :P
                    fileName = fileName.replace(/ /g, '_')
                }

                if (file.name.length > 32) {
                    const justFileExt = fileName.substring(fileName.lastIndexOf('.'))
                    // Truncate the file_name to 32 characters
                    fileName = fileName
                        .substring(0, fileName.lastIndexOf('.'))
                        .substring(0, 32-justFileExt.length)

                    fileName = `${fileName}${justFileExt}`
                }
                // Get the full upload path from the server side
                this.requestUpload(fileName).then((object) => {
                    const {id, name} = object
                    // Send event with file to be uploaded
                    this.fileStore.set(id, {name, file})
                    this.$emit('readyToUpload', id)
                })
            }
            console.log(files)
            console.log(e)

            if (!this.chunked) {
                var vm = this
                for (let file of files) {
                    var reader = new FileReader()
                    reader.onload = (e) => {
                        vm.$emit('fileReady', e.target.result)
                    }

                    reader.readAsDataURL(file)
                }
            }
            return false;
        }
    }
}
</script>
