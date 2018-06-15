<template>
    <ol class="pagination-controls">
        <li v-for="(n, index) in pageCount" @click="$emit('selected', index+1)" :class="{'page-control': true, 'current-page': index+1 === currentPage}" role="presentation">
            {{index+1}}
        </li>
    </ol>
</template>

<script>
export default {
    name: 'pagination-controls',
    props: {
        currentPage: {
            default: 1
        },
        pageCount: {
            type: Number,
            default: 10
        }
    }
}
</script>

<style lang="scss">
.pagination-controls {
    width: 100%;

    li.page-control {
        margin: 3px;
        user-select: none;
        display: inline-block;
        background-color: #eee;
        min-width: 32px;
        padding: 0 2px;
        font-size: 1.2rem;
        border: 1px solid #26619C;
        border-radius: 5px;
        &:focus, &:hover, &.current-page {
            cursor: pointer;
            background-color: #ddd;
        }
    }
}
</style>
