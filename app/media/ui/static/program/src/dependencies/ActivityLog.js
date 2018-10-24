import groupDeps from './Group.js'
import {stashes, groups, links, images, discussions} from '../store.js'

export default async function dependencies(action, stashId) {
    const stashCollection = await stashes()
    const gdeps = await groupDeps()
    const stash = await stashCollection.getInstance(stashId)

    switch (action) {
    case 'create_post':
    case 'update_post':
    case 'delete_post':
    case 'save_post':
    case 'create_topic':
    case 'read_topic':
    case 'update_topic':
    case 'save_topic':
    case 'delete_topic':
        return { ...gdeps, groups: await groups(), discussions: await discussions(), content_item: stash.collections.content.collections.item, content_type: gdeps.content_types }

    case 'create_link':
    case 'read_link':
    case 'update_link':
    case 'delete_link':
    case 'comment_link':
    case 'save_link':
        return { ...gdeps, groups: await groups(), links: await links(), content_item: stash.collections.content.collections.item, content_type: gdeps.content_types }

    case 'create_image':
    case 'read_image':
    case 'update_image':
    case 'delete_image':
    case 'comment_image':
    case 'save_image':
        return { ...gdeps, groups: await groups(), images: await images(), content_item: stash.collections.content.collections.item, content_type: gdeps.content_types }

    default:
        return {}
    }
}

