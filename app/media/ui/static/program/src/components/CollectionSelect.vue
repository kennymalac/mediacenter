<template>
    <multiselect
        :value="value"
        @input="$emit('input', $event)"
        @tag="addTag"
        :options="options"
        :multiple="true"
        :custom-label="optionLabel"
        :taggable="taggable"
        track-by="id"
        />
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
    name: 'collection-select',
    props: {
        // name: [String],
        // 
        value: [Array],
        taggable: {
            type: Boolean,
            default: false
        }
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
        this.collection().then((store) => {
            this.options = store.values
        })
    },
    methods: {
        addTag(tag) {
            // noop
        }
    }
}
</script>

<style lang="scss">
</style>
