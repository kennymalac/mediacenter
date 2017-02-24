<template>
    <div v-click="action" :class="[toolbarItemClass, iconClass]"><a></a></div>
</template>

<script>
export default {
    props: ['iconClass', 'action'],
    data() {
        return {
            toolbarItemClass: 'toolbar-icon',
            iconClass: '',
            action() {
                // 
            }
        }
    }
}
</script>

<style scoped lang="scss">
.toolbar-icon {
    /*width: 32px;*/
    /*height: 32px;*/
    font-size: 1.5em;
    margin-right: .5em;
    text-align: center;
    display: inline-block;
    position: relative;
    cursor: pointer;
    color: rgb(127, 140, 141);
    top: .25em;
    width: 1.25em;
    height: 1.25em;
    background: linear-gradient(0deg, #001f3f, rgba(52, 73, 94,1.0));

    :active {
        background: linear-gradient(18deg, #001f3f, rgba(52, 73, 94,1.0));
    }
}
</style>
