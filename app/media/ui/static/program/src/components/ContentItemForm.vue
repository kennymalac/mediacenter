<template>
    <div>
        <div v-if="!showUploadForm" class="content-types effect7">
            <div v-for="ctype in contentTypes" @click="linkCreate(ctype)" class="content-type-choice">
                <div class="icon">
                    <i :class="ctype.icon"></i>
                </div>
                <span class="type-name">{{ ctype.name }}</span>
            </div>
        </div>
        <div v-if="showUploadForm">
            <div v-if="selected.name === 'Image'" class="content-types selected effect7">
                <div @click="" class="content-type-choice">
                    <div class="icon">
                        <i :class="selected.icon"></i>
                    </div>
                    <span class="type-name">{{ selected.name }}</span>
                </div>
                
                <form>
                    <span class="upload-title">Upload an image</span>
                    <!-- <input type="text" name="title" /> -->
                    <!-- <input type="text" name="description" /> -->
                    <!-- multiselect -->
                    <button type="button" @click="showUploadForm = false" class="error"><i class="ion-ios-undo"></i> Cancel</button>
                </form>
            </div>
            
            <div v-if="selected.name === 'Link'" class="content-types effect7">
                <div @click="linkCreate(selected.name)" class="content-type-choice selected">
                    <div class="icon">
                        <i :class="selected.icon"></i>
                    </div>
                    <span class="type-name">{{ selected.name }}</span>
                </div>
                
                <form>
                    <span class="upload-title">Link title</span>
                    <!-- <input type="text" name="title" /> -->
                    <!-- <input type="text" name="description" /> -->
                    <!-- multiselect -->
                    <button type="button" @click="showUploadForm = false" class="error"><i class="ion-ios-undo"></i> Cancel</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showUploadForm: false,
            selected: {},
            form: "",
            contentTypes: [
                {
                    name: "Blog",
                    icon: "ion-md-text"
                },
                {
                    name: "Topic",
                    icon: "ion-ios-chatboxes"
                },
                {
                    name: "Image",
                    icon: "ion-md-image"
                },
                // {
                //     name: "Video",
                //     icon: "ion-md-videocam"
                // },
                {
                    name: "Link",
                    icon: "ion-ios-link"
                }
            ]
        }
    },
    methods: {
        linkCreate(ctype) {
            this.selected = ctype
            if (ctype.name === "Image" || ctype.name === "Link") {
                this.showUploadForm = true
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
