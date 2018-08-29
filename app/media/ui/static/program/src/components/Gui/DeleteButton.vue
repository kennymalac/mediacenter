<template>
    <context-menu style="display: inline" :menuItems="deleteMenuItems">
        <button type="button" slot="button" class="error">
            <i class="ion-md-close"></i> Delete
        </button>
    </context-menu>
</template>

<script>
import ContextMenu from '../Gui/ContextMenu'

export default {
    components: {ContextMenu},
    props: {
        objectName: String
    },
    data() {
        return {
            deleteMenuItems: [
                {
                    name: `Yes, delete this ${this.objectName}`,
                    action: () => this.$emit('delete')
                }
            ]
        }
    }
}
</script>
