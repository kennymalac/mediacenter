<script>
import CollectionSelect from './CollectionSelect'
//import debounce from 'debounce'

import {places, activeUser} from '../store.js'
//import placeDeps from '../dependencies/Place.js'

export default {
    name: 'place-select',
    mixins: [CollectionSelect],
    props: {
        search: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            collection: places
        }
    },
    async mounted() {
        const owner = await activeUser()
        
        const placeCollection = await places()
        await placeCollection.getActiveUserPlaces(owner, {})
    },
    methods: {
        optionLabel(option) {
            return option.name
        },
        asyncSearch() {

        }
    }
}
</script>
