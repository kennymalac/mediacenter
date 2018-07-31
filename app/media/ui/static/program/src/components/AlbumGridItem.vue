<template>
    <div class="album" @click="selectAlbum()">
        <div class="album-icon">
            <img v-if="album.thumbnail" :src="album.thumbnail.src" :alt="album.thumbnail.alt" class=""/>
            <i v-if="!album.thumbnail" class="ion-ios-images-outline" />
        </div>
        <div class="album-title">
            <label v-if="album.title && album.owner">
                {{album.title}} by {{album.owner.username}}
            </label>
        </div>
    </div>
</template>

<script>
// thumbnail: {
// alt: 'An image',
// src: ''
// },
export default {
    props: {
        album: [Object],
        btnText: {
            type: String,
            default: "Show"
        }
    },
    data() {
        return {
        }
    },
    methods: {
        selectAlbum(album) {
            this.$emit('albumSelected', this.album)
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

.album {
    box-shadow: 0 0.2rem 0 #49637e;
    display: flex;
    width: calc(100% - 20px);
    height: 10rem;
    margin: 10px;
    border-width: 0.1rem;
    border-bottom-width: 0rem;
    border-color: #001f3f;


    border-style: solid;
    border-radius: 6px;
    i.ion-ios-images-outline {
        font-size: 3rem;
    }
    .album-icon {
        color: #34495e;
        justify-content: center;
        width: 100%;
    }
    .album-title {
        height: 1em;
    }

    height: calc(100% - 4px);
    width: calc(100% - 2px);
    border-style: solid;
    border-radius: 6px;
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    transition: $picnic-transition;

    &:hover, &:focus {
        border-color: #49637e;
        cursor: pointer;
        text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
    }
    &:active {
        box-shadow: none;
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
