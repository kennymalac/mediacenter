<template>
    <form class="poll-form">
        <transition name="view-fade" mode="out-in">
            <div class="results">
                <h4>{{ title }}</h4>
                <transition-group name="options" tag="ul">
                    <li :key="option.id" v-for="(option, index) in sortedChoices">
                        <context-menu style="display: inline" :menuItems="removeOptionItem(option.id)">
                            <button slot="button" class="error" type="button">
                                <i class="ion-md-remove"></i>
                            </button>
                        </context-menu>
                        <input class="order" min="0" :max="maxOrder" type="number" v-model="option.order" />
                        <label>
                            <span contentEditable class="checkable">{{ option.title }}</span>
                        </label>
                    </li>
                </transition-group>
                <div style="display: flex">
                    <button type="button" class="warning" @click="addOption" style="margin-right: .3rem"><i class="ion ion-ios-create"></i> Add option</button>
                </div>
                <br />
                <button type="button" @click="$emit('save', choices)" style="margin-right: .3rem">{{ submitBtnText }}</button>
            </div>
        </transition>
    </form>
</template>

<script>
import ContextMenu from '../Gui/ContextMenu'

export default {
    name: 'poll-form',
    components: {ContextMenu},
    props: {
        submitBtnText: {
            type: String,
            default: "Save changes"
        },
        title: String,
        options: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            choices: this.options.length ? this.options : [
                { id: 0, order: 0, title: "New Option (click to edit)" }
            ],
            showResults: false
        }
    },
    computed: {
        maxOrder() {
            return Math.max(this.choices.length,
                            this.choices.map((item) => parseInt(item.order))
                            .reduce((accumulator, value) => Math.max(accumulator, value)))
        },
        sortedChoices() {
            return this.choices.sort((_item1, _item2) => {
                const item1 = parseInt(_item1.order)
                const item2 = parseInt(_item2.order)

                if (item1 === item2) {
                    return 0
                }
                return item1 > item2 ? 1 : -1
            })
        }
    },
    methods: {
        addOption() {
            this.choices.push({
                id: Math.max(this.choices.length,
                             this.choices.map((item) => parseInt(item.order))
                             .reduce((accumulator, value) => Math.max(accumulator, value))),
                order: this.choices.length,
                title: "New Option (click to edit)"
            })
        },
        removeOptionItem(id) {
            return [
                {
                    name: "Yes, delete this option",
                    action: () => {
                        window.setTimeout(() => {
                            this.choices = this.choices.filter((item) => item.id !== id)
                        }, 200)
                    }
                }
            ]
        }
    }
}
</script>

<style lang="scss">
.poll-form {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    width: 90%;
    min-height: 300px;
    .options-enter-active, .options-leave-active {
        transition: all 1s;
    }
    .options-enter, .options-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
    .options-move {
        transition: transform 1s;
    }
    button.error {
        font-size: .75rem;
    }
    input.order {
        width: 2.5rem;
        padding: 0;
        text-align: center;
        display: inline-block;
    }
    div.results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: auto;

        ul > li {
            list-style: none;
        }
   }
}
</style>
