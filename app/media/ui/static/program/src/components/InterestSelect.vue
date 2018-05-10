<script>
import CollectionSelect from './CollectionSelect'
import {InterestCollection} from '../models/Interest.js'
import {interests} from '../store.js'

export default {
    name: 'interest-select',
    mixins: [CollectionSelect],
    props: {
        taggable: {
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
            console.log(option)
            return option.name
        },
        addTag(tag) {
            InterestCollection.create({
                name: tag
            }).then((instance) => {
                this.options.push(instance)
            })
        }
    }
}
</script>
