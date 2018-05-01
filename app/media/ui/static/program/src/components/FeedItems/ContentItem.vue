<template>
    <div class="content-item">
        <slot name="embed" :slotProps="embedProps">
        </slot>
    </div>
</template>

<script>
import FeedItem from './mixins/FeedItem'

export default {
    name: 'content-item',
    mixins: [FeedItem],
    props: {
        embedProps: [Object]
    }
}
</script>

<style lang="scss">
.content-item {
    display: inline-flex;
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 4px / 5px;
    width: 320px;
    height: 240px;
}
</style>
