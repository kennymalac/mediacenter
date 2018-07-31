<template>
    <div class="action-list">
        <action-button v-for="action in actions" v-bind="action" />
    </div>
</template>

<script>
import ActionButton from './ActionButton'

export default {
    components: {
        ActionButton
    },
    props: {
        actions: {
            type: Array,
            default: []
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

$light-green: #47d378;
$dark-green: #2b9f67;
$shadow-color: rgba(0, 0, 0, .2);

.action-list {
    display: flex;
    flex-direction: column;
}
</style>
