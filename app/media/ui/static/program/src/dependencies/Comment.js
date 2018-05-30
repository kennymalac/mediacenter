import profileDeps from './Profile.js'

export default async function dependencies() {
    const profileReqs = await profileDeps()
    return {
        ...profileReqs,
        accounts: profileReqs.account,
        owner: profileReqs.account
    }
}
