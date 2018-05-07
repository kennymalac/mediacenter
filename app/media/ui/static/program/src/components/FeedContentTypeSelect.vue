<script>
import CollectionSelect from './CollectionSelect'
import {FeedContentTypeCollection} from '../models/FeedContentType.js'
import {feedContentTypes} from '../store.js'

export default {
    name: 'feed-content-type-select',
    mixins: [CollectionSelect],
    data() {
        return {
            collection: feedContentTypes
        }
    },
    methods: {
        optionLabel(option) {
            return FeedContentTypeCollection.typeMapping[option.name]
        }
    }
}
</script>

<style lang="scss">
</style>
