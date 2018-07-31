<template>
    <router-link :class="actionClass" :to="link">
        <div class="icon-container">
            <i v-if="icon" :class="icon"></i>
            <img v-if="image" height="100%" width="100%" :src="image" />
        </div>
        <h2><i v-if="extraIcon" :class="extraIcon"></i> {{ title }}</h2>
    </router-link>
</template>

<script>
export default {
    props: {
        link: {
            type: String,
            default: ""
        },
        size: {
            type: String,
            default: "medium"
        },
        icon: {
            type: String,
            required: false
        },
        title: {
            type: String,
            default: ""
        },
        extraIcon: {
            type: String,
            required: false
        },
        image: {
            type: [String, Object],
            required: false
        }
    },
    computed: {
        actionClass() {
            return {
                "action-button": true,
                [this.size]: true
            }
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

$light-green: #47d378;
$dark-green: #2b9f67;
$shadow-color: rgba(0, 0, 0, .2);

.action-button {
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    color: rgb(52, 73, 94);
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;

    h2 {
        i {
            color: $light-green;
        }
    }
    &.small {
        margin: 6px;
        padding: 12px;
        width: 220px;
        h2 {
            font-size: 1.2em;
            min-height: 1.5em;
        }
        .icon-container {
            width: 90px;
            height: 90px;
            i {
                font-size: 3.5rem;
            }
        }
    }
    &.medium {
        margin: 8px;
        padding: 16px;
        width: 280px;
        h2 {
            font-size: 1.35em;
            min-height: 2em;
        }
        .icon-container {
            width: 115px;
            height: 115px;
            i {
                font-size: 4.75rem;
            }
        }
    }
    &.large {
        margin: 10px;
        padding: 20px;
        width: 360px;
        h2 {
            font-size: 1.5em;
            min-height: 2.7em;
        }
    }
    border-width: 2px;
    border-color: $dark-green;
    border-style: solid;
    border-radius: 6px;

    transition: $picnic-transition;

    &:hover, &:focus {
        box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.35);
        .icon-container {
            opacity: .9;
            box-shadow: 0 3px 8px 0px rgba(0, 0, 0, .3);
        }
        cursor: pointer;
    }
    &:active {
        box-shadow: inset 0 0 0 99em rgba(52, 73, 94, 0.02);
        border-style: inset;
        .icon-container {
            opacity: .8;
            border-style: inset;
            img {
                opacity: .8;
            }
        }
    }
}
.icon-container {
    background: linear-gradient(150deg, white, rgba(0, 31, 63, 0.2));
    display: inline-flex;
    width: 140px;
    height: 140px;
    align-items: center;
    justify-content: center;
    i {
        font-size: 6rem;
    }
    img {
        transition: $picnic-transition;
        border-radius: 50%;
        height: 100%;
        width: 100%;
    }
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 50%;
    transition: $picnic-transition;

    box-shadow: 0 3px 8px 0px $shadow-color;
    &.icon-container-xs {
        width: 32px;
        border: 1px solid rgba(52, 73, 94,1.0);
        height: 32px;
        i {
            font-size: 1.25rem
        }
    }
}

</style>
