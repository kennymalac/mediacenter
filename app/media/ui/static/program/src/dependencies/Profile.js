import {accounts, interests, groups, profileComments} from '../store.js'

export default async function dependencies() {
    const [interestCollection, account, groupCollection, profileCommentCollection] = await Promise.all(
        [interests(), accounts(), groups(), profileComments()]
    )

    return {
        interests: interestCollection,
        account,
        member_groups: groupCollection,
        // TODO same field name but different collection value!
        comments: profileCommentCollection
    }
}
