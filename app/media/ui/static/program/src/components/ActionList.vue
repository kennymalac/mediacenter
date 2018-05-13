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
.icon-container {
    background: linear-gradient(150deg, white, rgba(0, 31, 63, 0.2));
    display: inline-flex;
    width: 140px;
    height: 140px;
    align-items: center;
    justify-content: center;
    i {
        font-size: 6rem;
    }
    img {
        transition: $picnic-transition;
        border-radius: 50%;
        height: 100%;
        width: 100%;
    }
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 50%;
    transition: $picnic-transition;

    box-shadow: 0 3px 8px 0px $shadow-color;
}
</style>
