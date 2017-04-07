<template>
    <input v-if="multiple" @change="uploadMediaItems" type="file" multiple />
    <input @change="uploadMediaItems" type="file" />
</template>

<script>
export default {
    name: "file-upload",
    props: ["multiple"],
    data() {
        return {}
    },
    methods: {
        uploadMediaItems(e) {
            console.log(this.mediaItems)
            var files = e.target.files || e.dataTransfer.files

            console.log(files)
            console.log(e)

            if (!files.length) {
                return
            }

            var vm = this
            for (let file of files) {
                // TODO Use Web Worker
                var reader = new FileReader()
                reader.onload = (e) => {
                    vm.$emit('fileReady', e.target.result)
                }

                reader.readAsDataURL(file)
            }
        }
    }
}
</script>
