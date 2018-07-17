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

    constructor(typeCheck, create, dependencies = []) {
        this.typeCheck = typeCheck
        this.create = create
        this.dependencies = dependencies
    }

    async resolve(resolvedDeps) {
        if (this.value !== null && this.value !== undefined && this.typeCheck(this.value)) {
            return this.value
        }
        else if (this.value instanceof Promise) {
            return await this.value
        }
        this.value = (async function(create, deps) {
            return create(await deps)
        })(this.create.bind(this), resolvedDeps)
        this.value = await this.value
        return this.value
    }
}
