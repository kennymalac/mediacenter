<template>
    <div class="modal" v-show="isOpen">
        <div class="modal-title">
            <slot name="title">
            </slot>

            <modal-toolbar-item class="close-btn" :icon-class="'ion-md-close'" :action="onClose" />

            <hr/>
        </div>

        <div class="modal-content">
            <slot>
            </slot>
        </div>
    </div>
</template>

<script>
import ModalToolbarItem from './ModalToolbarItem'

export default {
    props: ["onClose", "isOpen"],
    components: {
        ModalToolbarItem
    },
    data() {
        return {
            infoBox: {
                status: "",
                message: ""
            },
            user: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
    }
}
</script>


<style lang="scss">
@import "../../../classicTheme.scss";

.modal {
    border-radius: 3px/2px;
    display: block;
    position: absolute;
    border: 2px solid #001f3f;
    width: 85%;
    height: 50rem;
    margin-left: 7.5%;
    margin-right: 7.5%;
    box-sizing: content-box;
    animation-name: slideup;

    .modal-title {
        width: 100%;
        height: 2.75rem;
        display: block;
        text-align: center;
        background: linear-gradient(180deg, #001f3f, rgba(52, 73, 94,1.0));
        color: #DDDDDD;

        .toolbar {
            display: inline-block;
            position: absolute;
            left: 10rem;
        }
        /* &.label { */
        /* } */
        .close-btn {
            position: absolute;
            right: 0;
        }
    }
    /* alternative color: rgba(52, 73, 94,1.0)*/

    .go-back, .go-forward {
        &:active {
            color: $classicblue; /*#34497d;*/
            /*linear-gradient(18deg, #001f3f, rgba(52, 73, 94,1.0));*/
        }

        &.disabled {
            color: rgb(127, 140, 141);
            cursor: default;
        }

        display: inline-block;
        position: absolute;
        text-align: center;
        top: 20%;
        width: 2.25rem;
        font-size: 3.5rem;
        cursor: pointer;
        color: rgb(52, 73, 94);
    }

    .go-back {
        /*margin-right: 4rem;*/
        left: 2rem;
    }

    .go-forward {
        /*margin-left: 4rem;*/
        right: 2rem;
    }
}
/* .media-modal-view .modal-title label { */
/*     // silver */
/*     // alternative color: rgba(236, 240, 241,1.0); */
/* } */

/* /\* pictogram.type *\/ */
/* pictogram.photo { */
/*  /\* icon = photo *\/ */
/* } */

/* pictogram.video { */
/*  /\* icon = camcorder *\/ */
/* } */

.modal {
    .modal-content {
        display: block;
        height: 94%;
        background-color: rgb(236, 240, 241)/*rgba(149, 165, 166,1.0)*/;
    }
    hr {
        width: 90%;
        border: 0;
        margin-left: 5%;
        margin-top: 1rem;
        height: 1px;
        /* transparent gray to blueish light gray */
        background: linear-gradient(135deg, rgba(221, 221, 221, 0), rgba(236, 240, 241,1.0), rgba(221, 221, 221, 0));
    }
}
</style>
