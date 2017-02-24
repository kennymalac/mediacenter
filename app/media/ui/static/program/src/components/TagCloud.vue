<template>
    <div class="tag-cloud">
        <template v-for="tag in tags">
            <div>
                <!-- TODO: Investigate dynamic routing

                     Test to see if you can create a Router at run-time
                   -->
                <router-link to="">{{tag.name}}</router-link>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tags: []
        }
    },
    methods: {
        getTags(mediaItem) {
            fetch('api/', {

            })
        }
    }
}
</script>

<style scoped lang="scss">
</style>
