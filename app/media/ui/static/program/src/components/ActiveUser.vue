<template>
    <context-menu style="height: 100%" @toggle="toggleMenu" :menuItems="menuItems">
        <div slot="button" class="profile-embed">
            <div class="icon-container icon-container-xs">
                <img v-if="picture" :src="picture" />
                <i v-if="!picture" class="ion-md-person"></i>
            </div>
            <span :class="{ 'display-name': true, 'toggled': toggled }">{{name}}</span>
            <i :class="iconClass"></i>
        </div>
    </context-menu>
</template>

<script>
import ContextMenu from './Gui/ContextMenu'
import {activeUser} from '../store.js'

export default {
    // methods: {
    // // async mounted() {
    
    //     // },
    //     }
    components: { ContextMenu },
    data() {
        return {
            user: { details: { profile: { id: 0 } } },
            picture: "",
            toggled: false,
            name: ""
        }
    },
    async mounted() {
        this.user = await activeUser()
        console.log(this.user)
        this.name = this.user.details.profile.display_name
        this.picture = this.user.details.profile.picture
    },
    computed: {
        iconClass() {
            return {
                'ion': true,
                'ion-md-arrow-dropdown': true,
                'toggled': this.toggled
            }
        },
        menuItems() {
            return [
                {
                    icon: '<i class="ion ion-md-contact"></i>',
                    name: 'Profile',
                    action: () => {
                        this.$router.replace({
                            name: 'Profile',
                            params: {
                                profileId: this.user.details.profile.id,
                                profileAction: 'details'
                            }
                        })
                    }
                },
                // {
                //     icon: '<i class="ion ion-md-settings"></i>',
                //     name: 'Settings',
                //     action: () => {}
                // },
                {
                    icon: '<i class="ion ion-md-log-out"></i>',
                    name: 'Logout',
                    action: () => {
                        this.$router.replace({
                            name: 'Login'
                        })
                    }
                }
            ]
        }
    },
    methods: {
        toggleMenu(isActive) {
            this.toggled = isActive
        }
    }
}

</script>

<style scoped lang="scss">
@import "~picnic/src/themes/default/_theme.scss";
    .context-menu {
display: inline-block;
&.hover {
}
    }
    i.toggled {
    transform: rotateZ(180deg);
    }
div.profile-embed {
    .ion-md-arrow-dropdown {
        transition:all .25s ease-in-out;
        font-size: 1.25rem;
        padding-left: 5px;
        padding-right: 5px;
    }
    .display-name {
box-shadow: none;
color: black;
    margin-left: 5px;
    transition: $picnic-transition;
&.toggled, &:hover, &:focus {
            color: #49637e;
}
    }
    height: 100%;
    padding: 6px;
    user-select: none;
    height: 100%;
    display: flex;
    text-align: center;
    align-items: center;
}
</style>
