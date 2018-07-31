<script>
export default {
    data() {
        return {
            pageSize: 10,
            pageMinOrder: 0,
            pageMaxOrder: 0,
            itemCount: 0,
            isPaginating: false
        }
    },
    computed: {
        pageCount() {
            return Math.ceil(this.itemCount / this.pageSize) || 1
        },
        currentPage() {
            return this.query.page ? parseInt(this.query.page) : 1
        }
    },
    methods: {
        async selectPage(page) {
            if (this.isPaginating) {
                // Paginator is busy
                return
            }

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
            if (this.itemCount !== 0 && response.results[0]) {
                this.pageMinOrder = response.results[0].order
                this.pageMaxOrder = response.results.slice(-1)[0].order
            }
            this.isPaginating = false
        },

        isItemVisibleOnPage(item) {
            return item.order >= this.pageMinOrder && item.order <= this.pageMaxOrder
        }
    }
}
</script>
