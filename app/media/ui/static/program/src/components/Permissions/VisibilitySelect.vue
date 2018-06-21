<script>
import SelectMixin from '../Gui/Form/SelectMixin'

export default {
    name: 'visibility-select',
    mixins: [SelectMixin],
    props: {
        value: String
    },
    data() {
        return {
            options: [
                'Public',
                'Unlisted',
                'Private'
            ]
        }
    }
}
</script>
