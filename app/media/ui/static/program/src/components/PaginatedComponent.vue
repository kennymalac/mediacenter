<script>
export default {
    data() {
        return {
            pageSize: 10,
            pageMinOrder: 0,
            pageMaxOrder: 0,
            itemCount: 0
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.itemCount / this.pageSize)
        },
        currentPage() {
            return this.query.page ? parseInt(this.query.page) : 1
        }
    },
    methods: {
        async selectPage(page) {
            this.$router.push({
                query: {
                    page: page
                }
            })
            this.$nextTick(() => {
                this.listChildren()
            })
        },

        paginate(response) {
            this.itemCount = response.count
            this.pageMinOrder = response.results[0].order
            this.pageMaxOrder = response.results.slice(-1)[0].order
        },

        isItemVisibleOnPage(item) {
            return item.order >= this.pageMinOrder && item.order <= this.pageMaxOrder
        }
    }
}
</script>
