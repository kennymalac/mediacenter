import {groups, feeds, interests, stashes, accounts, profiles, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [groupCollection, members, feed, profile, stashCollection, interestCollection, contentTypes] = await Promise.all(
        [groups(), accounts(), feeds(), interests(), profiles(), stashes(), interests(), feedContentTypes()]
    )

    return {
        members, feed, profile, stashes: stashCollection, interests: interestCollection, content_types: contentTypes, owner: members, friends: members, member_groups: groupCollection, account: accounts
    }
}
