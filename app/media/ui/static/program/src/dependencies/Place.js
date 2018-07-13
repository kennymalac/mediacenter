import profileDeps from './Profile.js'
import {profiles, feeds} from '../store.js'

export default async function dependencies() {
    const deps = await profileDeps()
    return {
        profile: await profiles(),
        owner: deps.account,
        default_feed: await feeds(),
        ...deps
    }
}
