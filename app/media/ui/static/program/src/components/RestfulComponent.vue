<script>
export default {
    props: {
        id: [String],
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
            return {
                list: this.action === "list",
                details: this.action === "details",
                manage: this.action === "manage",
                create: this.action === "create"
            }
        }
    },
    methods: {
        restAction(to) {
            this.initialState()
            if (!to) {
                to = {params: {action: this.action, id: this.id}}
            }
            switch (to.params.action) {
            case "create":
                this.create()
                break
            case "details":
                this.details(to.params)
                break
            case "manage":
                this.manage(to.params)
                break
            case "list":
                this.list(to.params)
                break
            }
        }
    }
}
</script>
