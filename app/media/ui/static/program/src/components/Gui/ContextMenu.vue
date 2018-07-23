<template>
    <div class="context-menu">
        <popper trigger="click" :options="options">
            <div class="popper">
                <div v-for="item in menuItems" @click="item.action" class="button pseudo popover-item">
                    {{item.name}}
                </div>
            </div>
            <div style="height: 100%" v-html="button" slot="reference">
            </div>
        </popper>
    </div>
</template>

<script>
import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/css/vue-popper.css'

export default {
    props: {
        menuItems: {
            type: Array,
            default: () => []
        },
        placement: {
            type: String,
            default: 'bottom'
        },
        button: {
            type: String,
            default: `<button class="icon"><div style="height: 100%">
                    <i class="ion ion-md-more" />
                </div></button>`
        }
    },
    components: {
        Popper
    },
    computed: {
        options() {
            return { placement: this.placement }
        }
    },
    data() {
        return {
            isMenuOpen: false
        }
    },
    methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen
        }
    }
}
</script>

<style lang="scss">
.context-menu {
    margin-top: 0;
    display: flex;
    height: 1.5rem;
    padding: 0;
    .popper {
        border-radius: 6px 6px 4px 4px;
        background: white;
        border: 1px solid rgba(20, 20, 20, 0.1);
        box-shadow: 0 2px 12px rgba(20, 20, 20, 0.15);
        -webkit-background-clip: padding-box;
        -moz-background-clip: padding;
        background-clip: padding-box;
        .popover-item {
            display: block;
            padding: 5px 20px;
        }
    }

    button.icon {
        justify-content: center;
        padding: .4rem .8rem;
        align-items: center;
        i.ion-md-more {
            padding: 0;
            font-size: 1.5rem;
        }
        background: linear-gradient(0deg, #001f3f, rgba(52, 73, 94,1.0));
        &:active {
            background: linear-gradient(18deg, #001f3f, rgba(52, 73, 94,1.0));
        }
    }
}
</style>
