<script>
import CollectionSelect from './CollectionSelect'
import {accounts} from '../store.js'

export default {
    name: 'account-select',
    mixins: [CollectionSelect],
    data() {
        return {
            collection: accounts
        }
    },
    methods: {
        optionLabel(option) {
            const { username } = option
            return username
        }
    }
}
</script>

<style lang="scss">
</style>
