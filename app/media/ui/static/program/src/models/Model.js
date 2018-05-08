export function serializeIds(values) {
    return values.map((val) => { return val.instance.id })
}

export class Collection {

    constructor(values, collections = {}) {
        this.store = values.map((val) => {
            return new this.constructor.Model(val, collections)
        })
        console.log(this.store)
        this.values = new Proxy(this.store, {})
    }
}

// Returns a Singleton for a Collection
export function makeCollection(getStore, storeVal, collection, makeCollection) {
    return new Promise((resolve, reject) => {
        const store = getStore()

        if (store[storeVal] instanceof Collection) {
            return resolve(store[storeVal])
        }
        makeCollection().then((collection) => {
            store[storeVal] = collection
            resolve(collection)
        })
    })
}

export class Model {

    static initialState = {}
    static fields = {}
    static fieldConverters = {}

    constructor(instance, collections = {}) {
        this.instance = instance

        for (const field of Object.keys(this.constructor.initialState)) {
            if (field in this.constructor.fields && collections[field] !== undefined) {
                // NOTE assumes that Collection is up-to-date
                // Initialize an array of model instances
                const store = collections[field]
                if (store instanceof this.constructor.fields[field]) {
                    const ids = this.instance[field].map((val) => { return val.id })
                    this.instance[field] = store.values.filter((data) => {
                        return ids.includes(data.id)
                    })
                }
                else {
                    throw new Error('invalid model')
                }
            }
            // Convert the field if there is a conversion function specified for this field
            else if (field in this.constructor.fieldConverters) {
                this.instance[field] = this.constructor.fieldConverters[field](this.instance[field])
            }

            Object.defineProperty(this, field, {
                get: () => { return this.instance[field] },
                set: (val) => { this.instance[field] = val }
            })
        }
    }

    static getNewInstance() {
        // TODO confusing, remove this
        return Object.keys(this.initialState)
            .filter(key => key !== 'id')
            .reduce((obj, key) => {
                obj[key] = this.initialState[key]
                return obj
            }, {})
    }
}
