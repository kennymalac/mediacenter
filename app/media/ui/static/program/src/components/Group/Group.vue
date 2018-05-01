<template>
    <div>
        <div class="create-group" v-if="actions.create">
            <div class="icon-container">
                <i class="ion-ios-people"></i>
            </div>
            <h2><i class="ion-md-add-circle"></i> Create a Group</h2>
        </div>
    </div>
</template>

<script>
export default {
    props: ['id', 'action'],
    components: {
    },
    computed: {
        actions() {
            return {
                list: this.action === "list",
                manage: this.action === "manage",
                create: this.action === "create"
            }
        }
    },
    watch: {
        '$route'(to, from) {
            this.restAction(to)
        }
    },
    mounted() {
        this.restAction()
    },
    methods: {
        initialState() {

        },
        restAction(to) {
            this.initialState()
            if (!to) {
                to = {params: {action: this.action, id: this.id}}
            }
            switch (to.params.action) {
            case "create":
                // this.album = {}
                break
            case "manage":
                // AlbumCollection.get(to.params.id).then((data) => {
                //     this.album = data
                // })
                break
            case "list":
                // AlbumCollection.searchAlbums().then((data) => {
                //     this.albums = data
                // })
                break
            }
        }
    }
}
</script>

<style lang="scss">
@import "~picnic/src/themes/default/_theme.scss";

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
    border: 2px solid rgba(52, 73, 94,1.0);
    border-radius: 50%;
    transition: $picnic-transition;

}
.create-group {
    background: linear-gradient(135deg, white, rgb(236, 240, 241));
    margin: 10px;
    padding: 20px;
    h2 i {
        color: #47d378;
    }
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 400px;
    border-width: 2px;
    border-color: #2b9f67;
    border-style: solid;
    border-radius: 6px;
    
    transition: $picnic-transition;

    &:hover, &:focus {
        box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.35);
        .icon-container {
            box-shadow: inset 0 0 0 99em rgba(255, 255, 255, 0.1);
        }
        cursor: pointer;
    }
    &:active {

        box-shadow: inset 0 0 0 99em rgba(52, 73, 94, 0.02);
        border-style: inset;
        .icon-container {
            box-shadow: inset 0 0 0 99em rgba(52, 73, 94, 0.05);
            border-style: inset;
        }
    }
}
</style>
