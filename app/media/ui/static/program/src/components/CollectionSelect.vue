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
        this.collection().then((store) => {
            this.options = store.values
        })
    }
}
</script>

<style lang="scss">
</style>
