<script>
export default {
    props: ['id', 'link', 'action', 'context', 'author'],
    render(h) {
        let template

        if (this.id === undefined || this.author.profile.id === undefined) {
            return (
                <div>
                </div>
            )
        }

        const profileUrl = {name: 'Profile', params: { profileId: this.author.profile.id.toString(), profileAction: 'details' }}

        switch (this.action) {
        case 'create_topic':
            template = (
                <div>
                    <router-link to={profileUrl}>{this.author.profile.display_name}</router-link> created a topic: <router-link to={this.link}>{this.context.instance.content_item.title}</router-link>
                </div>
            )
            break
        case 'read_topic':
            template = (
                <div>
                    <router-link to={profileUrl}>{this.author.profile.display_name}</router-link> viewed a topic: <router-link to={this.link}>{this.context.instance.content_item.title}</router-link>
                </div>
            )
            break
        case 'delete_topic':
            break
        case 'save_topic':
            break
        case 'create_link':
            template = (
                <div>
                    <router-link to={profileUrl}>{this.author.profile.display_name}</router-link> shared a link: <router-link to={this.link}>{this.context.instance.content_item.title}</router-link>
                </div>
            )
            break
        default:
            template = (
                <div>
                </div>
            )
        }

        return template
    }
}
</script>

<style lang="scss">
</style>
