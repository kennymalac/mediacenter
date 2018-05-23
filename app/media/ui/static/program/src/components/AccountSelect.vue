<script>
import CollectionSelect from './CollectionSelect'
import debounce from 'debounce'

import {accounts, profiles} from '../store.js'

export default {
    name: 'account-select',
    mixins: [CollectionSelect],
    props: {
        search: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            collection: accounts
        }
    },
    methods: {
        optionLabel(option) {
            const { username } = option
            return username
        },
        asyncSearch: debounce(async function(queryParams) {
            if (queryParams.length < 1) {
                return
            }
            const [accountCollection, profile] = await Promise.all(
                [this.collection(), profiles()]
            )
            accountCollection.list({ search: queryParams }, { profile })
        }, 200)
    }
}
</script>

<style lang="scss">
</style>
