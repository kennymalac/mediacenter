<template>
    <div class="poll-results">
        <h4>{{ title }}</h4>
        <transition name="view-fade" mode="out-in">
            <div class="results" key="0" v-if="showResults">
                <transition-group name="options" tag="ul" class="result-options">
                    <li :key="index" v-for="(option, index) in options">
                        <div v-if="userVotes.includes(option.id)" class="option-title"><b>{{ option.title }} ({{ option.value }} votes)</b></div>
                        <div v-else class="option-title">{{ option.title }} ({{ option.value }} votes)</div>
                        <div class="result">
                            <span :style="{ width: Math.min(99, results[index]).toString() + '%' }">
                                <span v-if="userVotes.includes(option.id)"><b>{{ results[index].toString() + '%' }}</b></span>
                                <span v-else>{{ results[index].toString() + '%' }}</span>
                            </span>
                            <span v-if="results[index] <= 0" :style="{ width: (99 - results[index]).toString() + '%', 'border-top-left-radius': '3px', 'border-bottom-left-radius': '3px'}"></span>
                            <span v-if="results[index] > 0" :style="{ width: (99 - results[index]).toString() + '%' }"></span>
                        </div>
                    </li>
                </transition-group>
                <p style="text-align: center">
                    Total votes: {{ totalVotes }}
                    <br />
                    <button v-if="isOwner" type="button" @click="$emit('editPoll')">
                        <i class="ion-md-create"></i> Edit
                    </button>
                    <button v-if="!voted" type="button" @click="() => showResults = false">
                        <i class="ion-ios-undo"></i> Cast vote
                    </button>
                </p>

            </div>
            <div class="results" key="1" v-else>
                <transition-group name="options" tag="ul">
                    <li :key="index" v-for="(option, index) in options">
                        <label>
                            <input type="radio" v-model="checked" :value="option.id" name="poll-option" />
                            <span class="checkable">{{ option.title }}</span>
                        </label>
                    </li>
                </transition-group>
                <div style="display: flex">
                    <button type="button" v-if="checked" @click="$emit('vote', checked)" style="margin-right: .3rem">Vote</button>
                    <button disabled v-else type="button">
                        Vote
                    </button>

                    <button type="button" @click="() => showResults = true" class="warning">View Results</button>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
    name: 'poll-results',
    props: {
        title: String,
        options: Array,
        userVotes: Array,
        isOwner: Boolean
    },
    data() {
        return {
            checked: false,
            showResults: false
        }
    },
    mounted() {
        if (this.userVotes.length) {
            this.showResults = true
        }
    },
    watch: {
        userVotes(oldVal, newVal) {
            if (oldVal.length !== newVal) {
                this.showResults = true
            }
        }
    },
    computed: {
        voted() {
            // TODO
            return false
        },
        results() {
            return this.options.map((option) => {
                return option.value === 0 ? option.value : ((option.value / this.totalVotes) * 100).toFixed(2)
            })
        },
        totalVotes() {
            if (!this.options.length) {
                return 0
            }
            return this.options.map((i) => { return i.value })
                .reduce((accumulator, result) => {
                    return accumulator + result
                })
        }
    }
}
</script>

<style lang="scss">
.poll-results {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    border: 1px solid black;
    width: 90%;
    .options-enter-active, .options-leave-active {
        transition: all 1s;
    }
    .options-enter, .options-leave-to {
        opacity: 0;
        transform: translateY(30px);
    }
    div.results {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        margin: auto;

        h4 {
            font-size: 1.25rem;
        }
        ul > li {
            list-style: none;
        }
        ul.result-options {
            width: 55%;
            text-align: left;
        }
        ul.result-options > li {
            margin-bottom: 8px;
            & > .result {
                text-align: center;
                display: flex;
                span {
                    vertical-align: top;
                    display: inline-block;
                    position: relative;
                    height: 1.5rem;
                    padding: 0;
                    border-top-right-radius: 3px;
                    border-bottom-right-radius: 3px;
                }
                span:last-child {
                    background: rgba(0,0,0,0.1);
                }
                span:first-child {
                    background: linear-gradient(to right, #ff7600, #ffb819);
                    span {
                        background: transparent;
                        mix-blend-mode: difference;
                    }
                    border-top-left-radius: 3px;
                    border-bottom-left-radius: 3px;
                }
            }
        }
   }
}
</style>
