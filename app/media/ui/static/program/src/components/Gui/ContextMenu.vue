<template>
    <div class="context-menu">
        <popper ref="popper" trigger="click" @show="$emit('toggle', true)" @hide="$emit('toggle', false)" :options="options">
            <div class="popper">
                <div v-for="item in menuItems" @click="(e) => selectMenuItem(e, item.action)" class="button pseudo popover-item">
                    <div v-html="item.icon" class="icon"></div>
                    {{item.name}}
                </div>
            </div>
            <template slot="reference">
                <slot name="button">
                    <button class="icon"><div style="height: 100%">
                            <i class="ion ion-md-more" />
                    </div></button>
                </slot>
            </template>
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
            default: ``
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
        },
        selectMenuItem(event, action) {
            this.$refs.popper.doClose()
            action(event)
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

.context-menu {
    margin-top: 0;
    display: flex;
    height: 1.5rem;
    padding: 0;

    .popper {
        transition: .3s visibility;
        border-radius: 6px 6px 4px 4px;
        background: white;
        top: 10px;
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
    .pseudo.popover-item {
        display: flex;
        padding-left: 10px;
        align-items: center;
        border-radius: 0;
        transition: $picnic-transition;
        box-shadow: none;

        &:hover, &:focus {
            color: #49637e;
        }
        .icon {
            padding-right: 10px;
            font-size: 1rem;
            display: inline-flex;
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
