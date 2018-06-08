import {profiles} from '../store.js'
import profileDeps from './Profile.js'

export default async function dependencies() {
    const profileReqs = await profileDeps()
    const profileCollection = await profiles()
    return {
        ...profileReqs,
        accounts: profileReqs.account,
        profile: profileCollection,
        owner: profileReqs.account,
        friends: profileReqs.account
    }
}
