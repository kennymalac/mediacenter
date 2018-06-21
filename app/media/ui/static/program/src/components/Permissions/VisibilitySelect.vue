<script>
import SelectMixin from '../Gui/Form/SelectMixin'

export default {
    name: 'visibility-select',
    mixins: [SelectMixin],
    props: {
        value: Object
    },
    data() {
        return {
            options: [
                { text: 'Public', value: '0' },
                { text: 'Unlisted', value: '1' },
                { text: 'Private', value: '9' }
            ]
        }
    }
}
</script>
