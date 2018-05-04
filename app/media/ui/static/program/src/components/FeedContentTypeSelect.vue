<template>
    <multiselect
        :value="value"
        @input="$emit('input', $event)"
        :options="options"
        :multiple="true"
        :custom-label="contentTypeLabel"
        track-by="id"
        />
</template>

<script>
import Multiselect from 'vue-multiselect'
import {FeedContentTypeCollection} from '../models/FeedContentType.js'

export default {
    props: {
        // name: [String],
        value: [Array]
    },
    components: {
        Multiselect
    },
    data() {
        return {
            options: [],
            selected: []
        }
    },
    mounted() {
        this.selected = this.value
        FeedContentTypeCollection.all()
            .then((options) => {
                this.options = options
            })
    },
    methods: {
        contentTypeLabel(option) {
            return FeedContentTypeCollection.typeMapping[option.name]
        }
    }
}
</script>

<style lang="scss">
</style>
