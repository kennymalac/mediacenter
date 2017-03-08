<template>
    <div class="media-upload-grid-item">
        <div class="pure-control-group">
            <label for="file">File</label>
            <input name="file" type="file" />
        </div>
        <div class="pure-control-group">
            <label for="title">Title</label>
        </div>

        <div class="upload-controls">
            {{title}} by {{owner.name}}
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            media: {
                owner: {},
                title: '',
                tags: []
            }
        }
    },
    // computed: {
    //     action() {
    //         return {
    //             manage: router.action == manage
    //         }
    //     }
    // },
    methods: {
        parseInputType() {
            // if (this.) {

            // }
        }
    }
}
</script>

<style scoped lang="scss">
.media-upload-grid-item {
   display: block;
   border: 2px solid #001f3f;
   border-radius: 3px/2px;
}
</style>
