import {accounts, interests, groups} from '../store.js'

export default async function dependencies() {
    const [interestCollection, account, groupCollection] = await Promise.all(
        [interests(), accounts(), groups()]
    )

    return {
        interests: interestCollection,
        account,
        member_groups: groupCollection
    }
}
