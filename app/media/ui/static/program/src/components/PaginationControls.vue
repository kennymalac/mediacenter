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
        background-color: #f9f9f9;
        min-width: 32px;
        padding: 0 2px;
        font-size: 1.2rem;
        //border: .1rem solid ;
        color: #2c3e50;
        border-radius: 5px;
        border-bottom: 1px solid #eee;
        box-shadow: 0 0 0.1rem rgba(0,0,0, .8);
        &:focus, &:hover, &.current-page {
            color: #26619C;
            cursor: pointer;
            box-shadow: 0 0 0.15rem #26619C;
            border-bottom: 1px solid #26619C;
        }
    }
}
</style>
