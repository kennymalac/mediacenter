<template>
    <div>
        within {{ restriction.distance}} {{ distanceUnit }}
        <input type="range" name="distance" min="1" max="300" v-model="restriction.distance" />
    </div>
</template>

<script>
const distanceUnits = { mi: "miles" }

export default {
    props: {
        place: [Object]
    },
    computed: {
        distanceUnit() {
            return distanceUnits[this.restriction.unit]
        }
    },
    data() {
        return {
            // TODO make this functional
            restriction: {
                distance: 100,
                unit: "mi"
            }
        }
    }
}
</script>

<style lang="scss">
</style>
