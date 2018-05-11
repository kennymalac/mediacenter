<template>
    <action-button :link="profileLink" icon="ion-md-person" :title="name" />
</template>

<script>
import ActionButton from '../ActionButton'

export default {
    props: ['id', 'name'],
    components: {
        ActionButton
    },
    computed: {
        profileLink() {
            return `${this.id}/details`
        }
    }
}
</script>
