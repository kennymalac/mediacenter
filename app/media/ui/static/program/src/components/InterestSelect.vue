<script>
import CollectionSelect from './CollectionSelect'
import debounce from 'debounce'

import {InterestCollection} from '../models/Interest.js'
import {interests} from '../store.js'

export default {
    name: 'interest-select',
    mixins: [CollectionSelect],
    props: {
        taggable: {
            type: Boolean,
            default: true
        },
        search: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            collection: interests
        }
    },
    methods: {
        optionLabel(option) {
            return option.name
        },
        addTag(tag) {
            InterestCollection.create({
                name: tag
            }).then((instance) => {
                this.values.push(instance)
                this.value.push(instance)
            })
        },
        asyncSearch: debounce(async function(queryParams) {
            if (queryParams.length < 1) {
                return
            }
            const interestCollection = await this.collection()
            interestCollection.list({ search: queryParams })
        }, 200)
    }
}
</script>
