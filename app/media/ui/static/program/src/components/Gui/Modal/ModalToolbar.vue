<template>

<toolbar-item v-for="item in buttons" :iconClass="item.icon"  />
</template>

<script>
import ModalToolbarItem from './ModalToolbarItem'

export default {
    name: 'modal-toolbar',
    props: ['buttons'],
    components: { 'toolbar-item': ModalToolbarItem },
    data() {
        return {
            buttons: []
        }
    }
}
</script>

<style scoped>
</style>
