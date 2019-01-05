<template>
    <div class="notification-preference">
        <div class="preference">
            <p-check v-model="isEnabled" class="p-switch p-fill" color="primary">{{name}}</p-check>
        </div>
        <select class="frequency" v-show="isEnabled" :value="frequency" @input="$emit('update:frequency', $event.target.value)">
            <option v-for="freqOption in frequencies" :value="freqOption"> {{ freqOption }}</option>
        </select>
    </div>
</template>

<script>
import {frequencyChoices} from '../../models/converters.js'
import PrettyCheck from 'pretty-checkbox-vue/check'

export default {
    name: 'notification-preference',
    components: { 'p-check': PrettyCheck },
    props: {
        name: String,
        frequency: String,
        enabled: Boolean
    },
    watch: {
        isEnabled(val) {
            this.$emit('update:enabled', val)
        }
    },
    data() {
        return {
            isEnabled: true,
            frequencies: Object.values(frequencyChoices)
        }
    }
}
</script>

<style lang="scss">
div.notification-preference {
    height: 62px;
    text-align: center;
    display: grid;
    grid-template-columns: 4fr 1fr;
    align-items: center;
    width: 620px;
    .preference {
        text-align: left;
    }
}
</style>
