import {groups, feeds, places, interests, stashes, accounts, profiles, comments, feedContentTypes} from '../store.js'

export default async function dependencies() {
    const [groupCollection, members, feed, profile, stashCollection, interestCollection, placeCollection, commentCollection, contentTypes] = await Promise.all(
        [groups(), accounts(), feeds(), profiles(), stashes(), interests(), places(), comments(), feedContentTypes()]
    )

    return {
        members, feed, profile, stashes: stashCollection, places: placeCollection, interests: interestCollection, content_types: contentTypes, comments: commentCollection, owner: members, friends: members, member_groups: groupCollection, account: accounts
    }
}
