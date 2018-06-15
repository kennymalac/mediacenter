<script>
import router from "../router/index.js"

export default {
    props: {
        id: [String],
        params: {
            type: Object,
            required: false
        },
        query: {
            type: Object,
            required: false
        },
        isNested: {
            type: Boolean,
            default: false
        },
        action: [String]
    },
    data() {
        return {
            instance: {},
            objects: []
        }
    },
    mounted() {
        this.restAction()
    },
    watch: {
        '$route'(to, from) {
            this.restAction(to, from)
        }
    },
    computed: {
        actions() {
            const action = this.isNested ? this.params[`${this.objectName}Action`] : this.action
            return {
                list: action === "list",
                details: action === "details",
                manage: action === "manage",
                create: action === "create",
                search: action === "search"
            }
        }
    },
    methods: {
        async findInstance(id) {
            // NOTE/TODO we don't need the entire list of objects for each instance
            const instance = this.objects.find((item) => {
                return item.id === parseInt(id)
            })
            return instance
        },
        async showInstance(id, fallthrough, collection, collections, parentId) {
            let instance

            if (this.objects.length === 0 && collection !== undefined) {
                const store = await collection()
                this.objects = store.values
            }

            if (this.objects.length !== 0) {
                // TODO no need to try this each time for details
                // just try getting the instance directly
                instance = await this.findInstance(id)
                if (instance && !instance.instance._isFake) {
                    return instance
                }
            }

            // Try getting instance directly
            if (collection) {
                try {
                    const store = await collection()
                    instance = parentId
                        ? await store.get(parentId, id, collections)
                        : await store.get(id, collections)

                    return instance
                }
                catch (error) {
                    console.log(error)
                }
            }

            router.replace(fallthrough)
        },
        restAction(to, from) {
            let link = {}

            if (from && to.path.indexOf(from.path) > -1) {
                // Do not rerender a component, this is a nested action
                // that was redirected from the same route
                return
            }
            this.initialState()

            if (!to) {
                const id = this.isNested ? this.params[`${this.objectName}Id`] : this.id
                const action = this.isNested ? this.params[`${this.objectName}Action`] : this.action
                link = {action: action, id: id}
            }
            else {
                const id = this.isNested ? to.params[`${this.objectName}Id`] : to.params.id
                const action = this.isNested ? to.params[`${this.objectName}Action`] : to.params.action
                link = {action: action, id: id}
            }
            switch (link.action) {
            case "create":
                this.create()
                break
            case "details":
                this.details(link)
                break
            case "manage":
                this.manage(link)
                break
            case "list":
                this.list(link)
                break
            case "search":
                this.search(link)
                break
            }
        }
    }
}
</script>
