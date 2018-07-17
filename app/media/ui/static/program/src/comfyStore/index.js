import {Singleton} from './singleton.js'

export class Store {
    state = {}
    store = {}

    constructor(initialState) {
        this.state = {...initialState}

        for (const key of Object.keys(initialState)) {
            Object.defineProperty(this.store, key, {
                get: () => {
                    let singleton = this.state[key]
                    if (singleton instanceof Singleton) {
                        const value = singleton.resolve(this.resolveSingletonDependencies(singleton, key))
                        singleton.deferred = false
                        return value
                    }
                    else {
                        throw new Error(`Field ${key} not defined in Store as a singleton value or is undefined`)
                    }
                },
                set: (value) => {
                    this.state[key].value = value
                }
            })
        }
    }

    deferredCollection(field, CollectionType, create, collectionDeps = {}, _deps = []) {
        const singleton = this.singleton(
            field,
            (value) => value instanceof CollectionType,
            create,
            _deps
        )
        //const collections = {}
        for (const [nestedField, singletonName] of Object.entries(collectionDeps)) {
            // collections[field] = {
            //     get: () => {
            //         return this.state[field].value
            //     }
            // }
            this.state[field].dependencies.push([nestedField, singletonName])
        }
        return singleton
    }

    singleton(field, typeCheck, create = () => {}, dependencies = []) {
        this.state[field] = new Proxy(new Singleton(typeCheck, create, dependencies), {
            construct(target, args) {
                return this.state[field]
            }
        })
        // Return a closure that resolves the instance
        return () => {
            return this.store[field]
        }
    }

    getRelatedSingletonValue(requesterSingleton, requester, name) {
        let singleton = this.state[name]

        // Do not resolve the requester singleton as part of the dependency resolution
        const needResolve = this.resolveSingletonDependencies(singleton, name, singleton.dependencies.filter((dep) => {
            const isAccessorPair = Array.isArray(dep)
            const singletonName = isAccessorPair
                  ? dep[1]
                  : dep

            return !dep.deferred && singletonName !== requester
        }))

        const requestedDep = singleton.dependencies.find((dep) => {
            const isAccessorPair = Array.isArray(dep)
            const singletonName = isAccessorPair
                  ? dep[1]
                  : dep

            return !dep.deferred && singletonName === requester
        })
        if (requestedDep) {
            // Use the singleton that was created already, do not re-resolve
            needResolve[requester] = requesterSingleton
        }

        singleton.deferred = false
        return singleton.resolve(needResolve)
    }

    async resolveSingletonDependencies(singleton, singletonName, _dependencies) {
        const depsKeys = []
        singleton.deferred = true
        const dependencies = _dependencies || singleton.dependencies.filter((dep) => {
            return !dep.deferred
        })

        const storedVals = dependencies.map((dep) => {
            const isAccessorPair = Array.isArray(dep)
            const depKey = isAccessorPair
                ? dep[0]
                : dep
            const depName = isAccessorPair
                ? dep[1]
                : dep

            depsKeys.push(depKey)
            return this.getRelatedSingletonValue(singleton, singletonName, depName)
        })

        const allDeps = await Promise.all(storedVals)

        const deps = {}
        // Assemble map of the dependency name to its resolved singleton value
        for (let i = 0; i < allDeps.length; i++) {
            deps[depsKeys[i]] = allDeps[i]
        }
        return deps
    }

    async resolveReducerDependencies(reducer, dependencies = []) {
        // TODO fix for Array dependencies
        const depsKeys = []
        const resolve = []
        for (const {key, storeLookupKey} of Object.entries(dependencies)) {
            depsKeys.push(key)
            resolve.push(this.store[storeLookupKey])
        }
        // Resolve all singletons in one go
        const allDeps = await Promise.all(resolve)

        const deps = {}
        // Assemble map of the dependency name to its resolved singleton value
        for (let i = 0; i++; i < allDeps.length) {
            deps[depsKeys[i]] = allDeps[i]
        }

        return deps
    }
}
