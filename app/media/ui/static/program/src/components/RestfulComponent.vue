<script>
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
            this.restAction(to)
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
        restAction(to) {
            this.initialState()
            let link = {}
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
