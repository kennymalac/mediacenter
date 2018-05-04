<template>
    <multiselect
        :value="value"
        @input="$emit('input', $event)"
        :options="options"
        :multiple="true"
        :custom-label="optionLabel"
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
        this.collection.all()
            .then((options) => {
                this.options = options
            })
    }
}
</script>

<style lang="scss">
</style>
