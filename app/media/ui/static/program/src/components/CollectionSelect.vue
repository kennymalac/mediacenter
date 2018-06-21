<template>
    <div>
    <template v-if="!search">
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

    <template v-if="search">
        <multiselect
            :value="value"
            @input="$emit('input', $event)"
            @tag="addTag"
            :options="options"
            :multiple="true"
            :custom-label="optionLabel"
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
    mounted() {
        this.selected = this.value
        this.collection().then((store) => {
            this.values = store.values
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
