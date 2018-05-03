<template>
    <router-link class="action-button" :to="link">
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
    margin: 10px;
    padding: 20px;
    h2 i {
        color: $light-green;
    }
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    user-select: none;
    
    width: 400px;
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
</style>
