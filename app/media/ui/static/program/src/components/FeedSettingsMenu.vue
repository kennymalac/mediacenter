<template>
    <div class="context-menu" style="margin-right: 80px;" @show="$emit('toggle', true)" @hide="$emit('toggle', false)">
        <popper ref="popper" trigger="click">
            <div class="popper">
                <div>
                    <label>Sort by:</label>
                    <select v-model="sortingOptionValue">
                        <option value="-updated">Newest</option>
                        <option value="updated">Oldest</option>
                        <option value="-created">Newest created</option>
                        <option value="created">Oldest created</option>
                    </select>
                </div>
            </div>
            <div slot="reference" style="display: flex; align-items: center; font-size: 3rem; color: #eee; text-shadow: #26619C 1px 1px 0.2rem;">
                <i class="ion-md-settings"></i>
            </div>
        </popper>
    </div>
</template>

<script>
import Popper from 'vue-popperjs'

export default {
    components: {Popper},
    props: {
        sortingOption: [String]
    },
    computed: {
        sortingOptionValue: {
            get() { return this.sortingOption },
            set(value) { this.$emit('update:sortingOption', value) }
        },
        menuItems() {
            return [
                {
                    name: this.isPinned ? "Unpin" : "Pin",
                    action: this.togglePin.bind(this)
                },
                {
                    name: "Delete",
                    action: () => {}
                }
            ]
        }
    }
}
</script>
