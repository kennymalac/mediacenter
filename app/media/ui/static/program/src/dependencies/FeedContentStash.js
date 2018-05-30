import {accounts, interests, feedContentTypes, comments} from '../store.js'

export default async function dependencies() {
    const [contentTypeCollection, owner, interestCollection, commentCollection] = await Promise.all(
        [feedContentTypes(), accounts(), interests(), comments()]
    )

    return {
        interests: interestCollection,
        comments: commentCollection,
        content_type: contentTypeCollection,
        owner
    }
}
