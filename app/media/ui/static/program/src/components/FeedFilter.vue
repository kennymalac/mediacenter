<template>
    <ul class="feed-filter">
        <li v-for="specifier in specifiers">
            <label>
                <input @click="filterToggled" type="checkbox" v-model="specifier.enabled" />
                <span class="checkable">{{ specifier.name }}</span>
            </label>
        </li>
    </ul>
</template>

<script>
export default {
    props: {
        filterToggled: {
            type: Function
        },
        specifiers: {
            type: Array,
            default: []
        }
    }
}
</script>

<style lang="scss">
.feed-filter {
    & > li {
        text-align: left;
        list-style: none;
    }
}
</style>
