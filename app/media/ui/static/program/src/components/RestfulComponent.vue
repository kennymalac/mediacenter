<script>
import router from "../router/index.js"

export default {
    props: {
        id: [String],
        params: {
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
                create: action === "create"
            }
        }
    },
    methods: {
        async findInstance(id, fallthrough) {
            // NOTE/TODO we don't need the entire list of objects for each instance
            const instance = this.objects.find((item) => {
                return item.id === parseInt(id)
            })
            if (instance === undefined) {
                router.replace(fallthrough)
            }
            return instance
        },
        async showInstance(id, fallthrough) {
            if (this.objects.length === 0) {
                await this.list()
            }
            return this.findInstance(id, fallthrough)
        },
        restAction(to, from) {
            let link = {}

            if (from && to.fullPath.indexOf(from.fullPath) > -1) {
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
            }
        }
    }
}
</script>
