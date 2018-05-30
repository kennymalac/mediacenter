<template>
    <div>
        <div v-if="!showUploadForm" class="content-types effect7">
            <div v-for="ctype in contentTypeOptions" @click="linkCreate(ctype)" class="content-type-choice">
                <div class="icon">
                    <i :class="ctype.icon"></i>
                </div>
                <span class="type-name">{{ ctype.title }}</span>
            </div>
        </div>
        <div v-if="showUploadForm">
            <div v-if="selected.title === 'Image'" class="content-types selected effect7">
                <div @click="" class="content-type-choice">
                    <div class="icon">
                        <i :class="selected.icon"></i>
                    </div>
                    <span class="type-name">{{ selected.title }}</span>
                </div>

                <form>
                    <span class="upload-title">Upload an image</span>
                    <!-- <input type="text" name="title" /> -->
                    <!-- <input type="text" name="description" /> -->
                    <!-- multiselect -->
                    <button type="button" @click="showUploadForm = false" class="error"><i class="ion-ios-undo"></i> Cancel</button>
                </form>
            </div>

            <div v-if="selected.title === 'Link'" class="content-types effect7">
                <div @click="linkCreate(selected.title)" class="content-type-choice selected">
                    <div class="icon">
                        <i :class="selected.icon"></i>
                    </div>
                    <span class="type-name">{{ selected.title }}</span>
                </div>

                <form>
                    <input v-model="form.content_item.title" type="text" name="title" placeholder="Link title" />
                    <input v-model="form.link" type="text" name="link" placeholder="https://example.com" />
                    <!-- multiselect -->
                    <div class="footer">
                        <button type="button" @click="showUploadForm = false" class="error"><i class="ion-ios-undo"></i> Cancel</button>
                        <input type="submit" @click.prevent="submit" text="Submit">
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import {links, feedContentTypes} from "../store.js"
import linkDeps from "../dependencies/Link.js"
import activeUserDeps from "../dependencies/activeUser.js"
import {LinkModel} from "../models/Link.js"
import router from "../router/index.js"

export default {
    props: {
        contentTypes: [Array],
        stash: [Object],
        feedId: [Number, String]
    },
    data() {
        return {
            showUploadForm: false,
            selected: {},
            form: {},
            contentTypeOptions: []
        }
    },
    async mounted() {
        const ctypes = await feedContentTypes()
        const values = ctypes.values.filter((ctype) => {
            return this.contentTypes.includes(ctype.title)
        })
        // Sort the content types by the order provided by the prop
        this.contentTypeOptions = this.contentTypes.map((title) => {
            return values.find((value) => {
                return value.title === title
            })
        })
    },
    methods: {
        linkCreate(ctype) {
            this.selected = ctype
            this.$emit('contentTypeSelected', ctype)
            if (ctype.title === "Image" || ctype.title === "Link") {
                this.showUploadForm = true
                this.form = LinkModel.getNewInstance()
            }
        },
        async submit() {
            const ownerDeps = await activeUserDeps()
            const ownerAccount = ownerDeps.members.getInstance(ownerDeps.owner.details.id, ownerDeps)

            this.form.content_item.owner = ownerAccount
            this.form.stash = this.stash
            this.form.feed = this.feedId

            if (this.selected.title === "Link") {
                const linkCollection = await links()
                console.log(this.form)
                linkCollection.create(this.form, await linkDeps(this.stash.id))
                    .then((instance) => {
                        console.log(instance)
                        router.push(`/feed/${this.feedId}/details/stash/${this.stash.id}/details/link/${instance.id}/manage`)
                    })
            }
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

$choice-width: 112px;

.content-types {
    display: flex;
    flex-direction: row;
    border-radius: 12px;
    width: calc(#{$choice-width} * 4 + 2px);
    height: 127px;
    //background-color: #eee;
    background: linear-gradient(135deg, white, #f7f9fa);
    form {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100%;
        input {
            width: 80%;
            height: 2rem;
            margin: 5px;
        }
        .footer {
            display: flex;
            flex-direction: row;
            button, input[type=submit] {
                margin: 0;
                margin-left: 5px;
                height: 2rem;
                line-height: 1rem;
                display: inline;
                width: 45%;
            }
        }
    }
    .go-back {
        display: inline-flex;
        align-self: flex-start;
    }
}

.effect7 {
    position: relative;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 4px rgba(0, 0, 0, 0.2) inset;
}

.content-type-choice {

    user-select: none;
    .icon i {
        font-size: 3em;
        padding: 5px;
    }
    width: $choice-width;
    padding: 10px 20px;

    border-width: 0;
    border-style: solid;
    border-color: #ddd;
    border-right-width: 1px;
    height: 125px;
    transition: $picnic-transition;


    font-weight: 600;
    &:hover, &:focus, &:active {
        box-shadow: 0 3px 8px 0px rgba(0, 0, 0, .1);

        .icon i {
            opacity: .9;
        }
        cursor: pointer;
    }


    &:active {
        box-shadow: inset 0 0 0 99em rgba(52, 73, 94, 0.02);
    }

    &:first-child {
        border-top-left-radius: 12px;
        border-bottom-left-radius: 12px;
    }

    &:not(.selected):last-child  {
        border-top-right-radius: 12px;
        border-bottom-right-radius: 12px;
        border-right: 0;
    }
}

</style>
