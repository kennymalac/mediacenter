import {stashes} from "../store.js"
import stashDeps from "./FeedContentStash.js"

export default async function dependencies(stashId) {
    const otherDeps = await stashDeps()

    const stashCollection = await stashes()
    const stash = await stashCollection.getInstance(stashId)

    return {
        ...otherDeps,
        content_item: stash.collections.content
    }
}
