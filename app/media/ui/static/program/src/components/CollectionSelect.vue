<template>
    <div>
    <template v-if="!search">
        <multiselect
            :value="value"
            @input="$emit('input', $event)"
            @tag="addTag"
            :options="options"
            :multiple="multiple"
            :custom-label="optionLabel"
            placeholder="Select option or type to search"
            :taggable="taggable"
            track-by="id"
            />
    </template>

    <template v-if="search">
        <multiselect
            :value="value"
            @input="$emit('input', $event)"
            @tag="addTag"
            :options="options"
            :multiple="multiple"
            :custom-label="optionLabel"
            placeholder="Select option or type to search"
            :taggable="taggable"
            track-by="id"
            @search-change="asyncSearch"
            />
    </template>
    </div>
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
        },
        multiple: {
            type: Boolean,
            default: true
        },
        search: {
            type: Boolean,
            default: false
        }
    },
    components: {
        Multiselect
    },
    computed: {
        options() {
            return this.values.all
                ? this.values.all()
                : this.values
        }
    },
    data() {
        return {
            values: [],
            selected: []
        }
    },
    async mounted() {
        const collection = await this.collection()
        this.selected = this.value
        this.values = collection.values
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
