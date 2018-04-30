<template>
    <button :data-size="size" :data-color="color" :data-spinner-size="spinnerSize" :data-spinner-color="spinnerColor" :data-spinner-lines="spinnerLines" class="ladda-button" data-style="expand-left">
        <span class="ladda-label">{{ text }}</span>
    </button>
</template>

<script>
const Ladda = require('ladda')

export default {
    name: 'ladda-button',
    props: {
        text: [String],
        isLoading: [Boolean],
        progressVal: {
            type: Number,
            default: 0
        },
        color: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: ""
        },
        spinnerSize: {
            type: String,
            default: ""
        },
        spinnerColor: {
            type: String,
            default: ""
        },
        spinnerLines: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            ladda: {}
        }
    },
    mounted() {
        this.ladda = Ladda.create(this.$el)
    },
    watch: {
        isLoading(newVal, oldVal) {
            console.log(oldVal, newVal)
            if (oldVal !== newVal) {
                this.ladda.toggle()
            }
        },
        progressVal(newVal) {
            this.ladda.setProgress(newVal)
        }
    }
}
</script>
