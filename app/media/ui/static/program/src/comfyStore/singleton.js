export async function makeSingleton(getStore, storeValue, typeCheck, create) {
    const store = getStore()

    if (typeCheck(store[storeValue])) {
        return store[storeValue]
    }
    else if (store[storeValue] instanceof Promise) {
        return await store[storeValue]
    }

    store[storeValue] = create()
    store[storeValue] = await store[storeValue]
    return store[storeValue]
}

export class Singleton {
    create = null
    dependencies = []
    typeCheck = null
    deferred = false

    constructor(typeCheck, create, dependencies = []) {
        this.typeCheck = typeCheck
        this.create = create
        this.dependencies = dependencies
    }

    get(deps) {
        if (this.value !== null && this.value !== undefined && this.typeCheck(this.value)) {
            return this.value
        }
        return this.resolve(deps)
    }

    async resolve(resolveDeps) {
        if (this.value instanceof Promise) {
            return await this.value
        }

        this.value = (async function(create, deps) {
            if (!deps) {
                console.log('no deps')
            }
            const all = deps ? await deps() : {}

            const value = await create(all)
            console.log('singleton value', value)
            return value
        })(this.create.bind(this), resolveDeps)
        this.created = true
        this.value = await this.value

        this.deferred = false
        return this.value
    }
}
