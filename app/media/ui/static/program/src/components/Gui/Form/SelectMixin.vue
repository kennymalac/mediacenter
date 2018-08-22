<template>
    <multiselect
        :value="value"
        @input="$emit('input', $event)"
        :options="options"
        :multiple="false"
        :allow-empty="!required"
        :custom-label="optionLabel"
        />
</template>

<script>
import Multiselect from 'vue-multiselect'

export default {
    components: {Multiselect},
    props: {
        search: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        optionLabel(option) {
            if (typeof option === 'string') {
                return option
            }
            const {text} = option
            return text
        }
    }
}
</script>
