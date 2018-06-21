<script>
import CollectionSelect from './CollectionSelect'
import debounce from 'debounce'

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
        async addTag(tag) {
            const interestCollection = await interests()
            interestCollection.create({
                name: tag
            }).then((instance) => {
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
