<template>
    <div class="toolbar">
        <toolbar-item v-for="item in buttons" :iconClass="item.icon" :action="item.action" />
    </div>
</template>

<script>
import ModalToolbarItem from './ModalToolbarItem'

export default {
    name: 'modal-toolbar',
    props: ['buttons'],
    components: {
        'toolbar-item': ModalToolbarItem
    },
    data() {
        return {
        }
    }
}
</script>

<style scoped>
</style>
