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
                        const value = singleton.getValue(() => this.resolveSingletonDependencies(singleton, key))
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
            _deps,
            true
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

    singleton(field, typeCheck, create = () => {}, dependencies = [], isDeferred = false) {
        if (this.state[field] instanceof Singleton) {
            throw new Error(`Can't replace Singleton value, value for field ${field} already exists`)
        }
        const singleton = new Singleton(typeCheck, create, dependencies)
        singleton.deferred = isDeferred
        this.state[field] = new Proxy(singleton, {
            construct(target, args) {
                return this.state[field]
            },
            set(obj, prop, value) {
                // console.log(`${field} singleton value set: `, obj, prop, value)
                return Reflect.set(...arguments)
            }
        })
        // Return a closure that resolves the instance
        return () => {
            //console.log('closure', field, this.store[field])
            return this.store[field]
        }
    }

    getRelatedSingletonValue(requesterSingleton, requester, name, dependencyBlacklist) {
        let singleton = this.state[name]

        // if (name === 'activeUser') {
        //console.log('parent: ', requester, 'blacklist', dependencyBlacklist, 'child: ', name)
        // }
        //console.log(singleton.dependencies)

        if (singleton.value !== undefined) {
            return singleton.getValue()
        }

        const _blacklist = dependencyBlacklist.slice(0)
        _blacklist.push(requester)

        // Do not resolve the requester singleton as part of the dependency resolution
        const resolved = this.resolveSingletonDependencies(singleton, name, singleton.dependencies.filter((dep) => {
            const isAccessorPair = Array.isArray(dep)
            const singletonName = isAccessorPair
                  ? dep[1]
                  : dep

            return !_blacklist.includes(singletonName) && !this.state[singletonName].created
        }), _blacklist)
        const needResolve = {}

        for (const dep of singleton.dependencies) {
            const isAccessorPair = Array.isArray(dep)
            const depKey = isAccessorPair
                  ? dep[0]
                  : dep
            const singletonName = isAccessorPair
                  ? dep[1]
                  : dep

            if (_blacklist.includes(singletonName)) {
                //console.log(requesterSingleton)
                needResolve[depKey] = [singletonName, this.state[singletonName]]
            }
            // this.state[singletonName].deferred && this.state[singletonName].value instanceof Promise
            else if (this.state[singletonName].created) {
                needResolve[depKey] = [singletonName, this.state[singletonName]]
            }
        }

        //console.log('needResolve', needResolve)
        return singleton.getValue(async() => {
            //console.log('resolved', resolved)
            const deps = await resolved
            //console.log('deps', deps)

            //console.log('needResolve', needResolve)
            const promisedDeps = {}
            for (const [key, value] of Object.entries(needResolve)) {
                const [_name, val] = value
                //console.log('blah', name, key, val)
                if (name !== _name && val.created && !val.deferred) {
                    deps[key] = await val.getValue()
                }
                // 
                else if (name === _name || val.dependencies.includes(name)) {
                    // Do not resolve circular dependency - resolve ourself first
                    promisedDeps[key] = val.getValue
                }

                else {
                    promisedDeps[key] = val.getValue()
                }
            }

            return {...deps, ...promisedDeps}
        })
    }

    async resolveSingletonDependencies(singleton, singletonName, _dependencies, blacklist = []) {
        const depsKeys = []

        const dependencies = _dependencies || singleton.dependencies

        if (dependencies.length === 0) {
            return {}
        }

        const storedVals = dependencies.map(async (dep) => {
            const isAccessorPair = Array.isArray(dep)
            const depKey = isAccessorPair
                ? dep[0]
                : dep
            const depName = isAccessorPair
                ? dep[1]
                : dep

            depsKeys.push(depKey)
            return this.getRelatedSingletonValue(singleton, singletonName, depName, blacklist)
        })

        //console.log('storedVals, depsKeys', storedVals, depsKeys)

        const allDeps = await Promise.all(storedVals)
        //console.log('allDeps', allDeps)

        const deps = {}
        // Assemble map of the dependency name to its resolved singleton value
        for (let i = 0; i < allDeps.length; i++) {
            deps[depsKeys[i]] = allDeps[i]
        }
        return deps
    }

    async resolveReducerDependencies(reducer, dependencies = []) {
        // TODO broken af
        // TODO fix for Array dependencies
        const depsKeys = []
        // const resolve = []
        const allDeps = []
        for (const [key, storeLookupKey] of Object.entries(dependencies)) {
            depsKeys.push(key)
            //resolved.push(this.store[storeLookupKey])
            allDeps.push(this.store[storeLookupKey])
        }
        // TODO Resolve all singletons in dependency tree
        // const allDeps = await Promise.all(resolve)

        const deps = {}
        // Assemble map of the dependency name to its resolved singleton value
        for (let i = 0; i++; i < allDeps.length) {
            deps[depsKeys[i]] = allDeps[i]
        }

        return deps
    }
}
