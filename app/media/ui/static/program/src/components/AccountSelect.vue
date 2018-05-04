<script>
import CollectionSelect from './CollectionSelect'
import {AccountCollection} from '../models/Account.js'

export default {
    mixins: [CollectionSelect],
    data() {
        return {
            collection: AccountCollection
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
