import {Subject} from 'rxjs'

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
    value$ = null

    constructor(typeCheck, create, dependencies = []) {
        this.typeCheck = typeCheck
        this.create = create
        this.dependencies = dependencies
    }

    observe(subscription) {
        if (!this.value$) {
            this.value$ = new Subject()
            const subscriber = this.value$.subscribe(subscription)
            this.value$.next(this.value)
            return subscriber
        }
        return this.value$.subscribe(subscription)
    }

    getValue(deps) {
        if (this.value !== null && this.value !== undefined && this.typeCheck(this.value)) {
            return this.value
        }
        return this.resolve(deps)
    }

    async resolve(resolveDeps) {
        if (this.value !== null && this.value !== undefined && this.typeCheck(this.value)) {
            return this.value
        }

        if (this.value instanceof Promise) {
            return await this.value
        }

        this.created = true
        this.value = (async () => {
            //console.log('resolving value ', this.value)
            const all = resolveDeps ? await resolveDeps() : {}

            const value = await this.create(all)
            //console.log('singleton value', value)
            return value
        })()
        this.value = await this.value

        this.deferred = false
        return this.value
    }
}
