<template>
    <popper class="bg-select" ref="popper" trigger="click" @show="$emit('toggle', true)" @hide="$emit('toggle', false)" :options="options">
        <div class="popper">
            <div class="tabs">
                <div :class="{tab: true, selected: selectedTab == tab.id}" v-for="tab in tabs" @click="selectTab(tab.id)">
                    <i :class="tab.icon"></i> {{ tab.name }}
                </div>
            </div>
            
            <!-- <input class="hidden" type="text" v-model="value" /> -->
            <template v-if="selectedTab == 'color-swatches'">
                <swatches value="colors" @input="(value) => $emit('update:colors', value)" />
            </template>
            <template v-if="selectedTab == 'color-sketch'">
                <sketch value="colors" @input="(value) => $emit('update:colors', value)" />
            </template>
        </div>
        <template slot="reference">
            <button type="button">
                <i class="ion-md-color-filter"></i> Background color
            </button>
        </template>
    </popper>
</template>

<script>
import { Sketch, Swatches } from 'vue-color'

import Popper from 'vue-popperjs'
import 'vue-popperjs/dist/css/vue-popper.css'

export default {
    components: { Popper, Sketch, Swatches },
    props: {
        colors: {
            type: Object,
            default: () => {}
        },
        placement: {
            type: String,
            default: 'bottom'
        }
    },
    data() {
        return {
            selectedTab: "color-swatches",
            tabs: [
                {
                    id: "color-swatches",
                    name: "Presets",
                    icon: "ion-ios-color-palette"
                },
                // {
                //     id: "image",
                //     name: "Image",
                //     icon: "ion-ios-image"
                // },
                {
                    id: "color-sketch",
                    name: "Color",
                    icon: "ion-ios-color-fill"
                }
            ]
        }
    },
    methods: {
        selectTab(id) {
            this.selectedTab = id
        }
    },
    computed: {
        options() {
            return { placement: this.placement }
        }
    }
}
</script>

<style lang="scss">
    .bg-select {
    .popper {
   width: 280px;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .vc-sketch {
        width: 260px;
    }
    .vc-swatches {
        width: 280px;
        height: 358px;
    }
.tabs {
    padding: 5px;
    margin-bottom: 5px;
    
    justify-content: space-between;
    width: 100%;
    display: flex;
    .tab {
        user-select: none;
        font-size: 1rem;
        &.selected, &:active, &:hover {
            color: #49637e;
            box-shadow: 0 0.1rem 0 #49637e;
        }
    }
}
}
}
</style>
