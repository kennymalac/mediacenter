import {activeUser, accounts, groups, interests, profiles} from "../store.js"

export default async function dependencies() {
    const [owner, members, profile, interestCollection, groupCollection] = await Promise.all(
        [activeUser(), accounts(), profiles(), interests(), groups()]
    )

    return {
        owner,
        groups: groupCollection,
        members,
        profile,
        interests: interestCollection
    }
}
