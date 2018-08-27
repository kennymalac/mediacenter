function mutateInstance(mutation) {
    const [instance, diff] = mutation
    const [changed, changes] = diff
    if (!changed) {
        return instance
    }

    instance.isFake = false
    instance.applyDiff(changes)
    return instance
}

export async function resolve(resolutions) {
    return await Promise.all([].concat.apply([], resolutions), 0)
}

// Courtesy: https://stackoverflow.com/users/420097/vincent
function getNestedValue(obj, str) {
    return str.split(/\.|\[/g).map(function(crumb) {
        return crumb.replace(/\]$/, '').trim().replace(/^(["'])((?:(?!\1)[^\\]|\\.)*?)\1$/, (match, quote, str) => str.replace(/\\(\\)?/g, "$1"))
    }).reduce(function(obj, prop) {
        return obj ? obj[prop] : undefined
    }, obj)
}

export class Collection {
    collections = {}

    constructor(values, collections = {}) {
        this.storedIds = []
        this.store = values.map((val) => {
            this.storedIds.push(val.id)
            return new this.constructor.Model({...val}, collections)
        })
        this.collections = {...this.collections, ...collections}

        this.values = new Proxy(this.store, {})
        this.values.all = (filter = () => true) => {
            return this.values.filter((value) => {
                return !value.instance._isFake && filter(value)
            })
        }
        this.promisedInstances = new Map()
        this.promisedMutations = new Map()
    }

    static async fetchAll(collections, initialData, dataCollections, getters = {}) {
        let keys = []
        let ops = []
        for (const [key, data] of Object.entries(initialData)) {
            const collection = dataCollections[key]
            keys.push(key)
            ops.push(collection.fetchInstance(data, collections, getters[key]))
        }

        const fetched = {}
        const vals = await Promise.all(ops)
        for (const val of vals) {
            fetched[keys.shift()] = val
        }
        return fetched
    }

    fetchInstance(item, collections, getter, always = false) {
        // NOTE not tested with nested resources
        const instance = item instanceof Model
              ? item
              : this.getInstance(item, collections)

        if (always || instance.instance._isFake) {
            let promised = this.promisedInstances.get(instance.id)
            if (promised instanceof Promise) {
                return this.promisedInstances.get(instance.id)
            }
            else {
                this.promisedInstances.set(
                    instance.id,
                    getter ? getter() : this.get.bind(this)(instance.id, collections, instance)
                )
                return this.promisedInstances.get(instance.id)
            }
        }
        else {
            this.promisedInstances.delete(instance.id)
        }
        return instance
    }

    getInstance(item, collections, isPrimaryKey) {
        if (isPrimaryKey === undefined && Number.isInteger(item)) {
            isPrimaryKey = true
        }

        const id = isPrimaryKey
            ? item
            : item.id

        const exists = this.storedIds.includes(id)

        if (exists) {
            return this.values.find((item) => { return item.id === id })
        }
        else if (isPrimaryKey) {
            return this.addFakeInstance(id)
        }
        else {
            return this.addInstance(item, collections)
        }
    }

    getInstances(items, collections, isPrimaryKeys) {
        let ids = []

        if (items.length > 0) {
            if (isPrimaryKeys === undefined && Number.isInteger(items[0])) {
                isPrimaryKeys = true
            }

            ids = isPrimaryKeys
                ? items.slice()
                : items.map((val) => { return val.id })
        }
        else {
            // There are no instances that are referenced yet
            return []
        }

        // Find existing model instances in the store if they exist,
        // if they do not exist create a new instance and append it to the field's respective store
        const existingIds = this.storedIds.filter((id) => {
            return ids.includes(id)
        })

        let existingInstances = []
        if (existingIds.length === 1) {
            const _id = existingIds[0]
            existingInstances.push(this.values.find((item) => {
                return _id === item.id
            }))
        }
        else if (existingIds.length > 1) {
            // Find all existing instances and stop looking if all instances have been found
            // NOTE: This is an optimization so the store is only looped over once
            const _foundIds = []
            const _numExisting = existingIds.length
            const _max = this.values.length
            for (let i = 0; _foundIds.length !== _numExisting || i < _max; i++) {
                const _id = this.values[i].id
                if (existingIds.includes(_id)) {
                    _foundIds.push(_id)
                    existingInstances.push(this.values[i])
                }
            }
        }

        const missingIds = ids.filter((id) => { return !existingIds.includes(id) })

        if (missingIds.length > 0) {
            if (isPrimaryKeys) {
                // These instances are being resolved "lazily"
                for (const id of missingIds) {
                    existingInstances.push(this.addFakeInstance(id))
                }
            }
            else {
                const missingInstances = items.filter((item) => {
                    return missingIds.includes(item.id)
                })
                for (const item of missingInstances) {
                    // Construct a new instance
                    existingInstances.push(this.addInstance(item, collections))
                }
            }
        }

        // Return ordered list of instances
        const instances = []
        for (const id of ids) {
            instances.push(existingInstances.find((data) => {
                return data.id === id
            }))
        }
        return instances
    }

    addInstance(data, collections) {
        const instance = new this.constructor.Model({...data}, {...collections, ...this.collections})
        this.storedIds.push(data.id)
        this.store.push(instance)
        return instance
    }

    addFakeInstance(id) {
        const instance = new this.constructor.Model({
            ...this.constructor.Model.initialState,
            _isFake: true,
            id: id
        })

        this.storedIds.push(id)
        this.store.push(instance)
        return instance
    }

    addInstances(values, collections) {
        return values.map((instance) => this.addInstance.bind(this)(instance, collections))
    }

    isCollectionOrPromise(collection) {
        return collection instanceof Collection || collection instanceof Promise
    }

    getNestedCollection(field, instance = {}, collections = {}) {
        // Make sure this is a Model to begin with
        let collection
        if (instance.collections && this.isCollectionOrPromise(instance.collections[field])) {
            collection = instance.collections[field]
        }
        else if (this.collections && this.isCollectionOrPromise(this.collections[field])) {
            collection = this.collections[field]
        }
        else {
            collection = collections[field]
        }

        if (!this.isCollectionOrPromise(collection)) {
            throw new Error(`Invalid model nested write! Resolved Collection for field ${field} not found.`)
        }

        return collection
    }

    addDeferredSync(instance, field, val, promisedCollection, collections = {}) {
        const deferredSync = async() => {
            this.collections[field] = await promisedCollection
            this.sync(instance, {[field]: val}, collections)
        }

        if (!instance._mutations) {
            instance._mutations = []
        }
        instance._mutations.push(deferredSync())
    }

    diffNestedModelField(instance, field, val, collections = {}, many = false, isPrimaryKeys = false) {
        const collection = this.getNestedCollection(field, instance, collections)
        if (collection instanceof Promise) {
            // This Collection has not resolved yet, the operation needs to be deferred
            // Defer the mutation until the collection resolves
            this.addDeferredSync(instance, field, val, collection, collections)
            return [false, undefined]
        }

        let store
        let changed = false
        let fieldChanges

        if (many) {
            let instances = []

            for (let i = 0; i < val.length; i++) {
                if (instance[field][i] !== val[i]) {
                    // There is a difference, refetch the instances
                    store = collection
                    instances = store.getInstances(val, collections, isPrimaryKeys)
                    changed = true
                    break
                }
            }

            if (store) {
                // Non-pk fields support nested writes
                if (!isPrimaryKeys) {
                    const nestedChanges = []

                    // For each instance, get a diff tree so it can later be applied
                    for (let i = 0; i < val.length; i++) {
                        nestedChanges.push([instances[i], store.diff(instances[i], val[i], collections)])
                    }

                    // Later this will function will be called to apply all nested changes
                    fieldChanges = () => nestedChanges.map(mutateInstance)
                }
                else {
                    fieldChanges = instances
                }
            }
        }
        else if (instance[field] !== val && (val !== null && instance[field] !== undefined)) {
            if (isPrimaryKeys && instance[field].id === val) {
                return [false]
            }
            changed = true
            store = collection
            const _instance = store.getInstance(val, collections, isPrimaryKeys)

            fieldChanges = !isPrimaryKeys
                ? () => mutateInstance([_instance, collection.diff(_instance, val, collections)])
                : _instance
        }

        return [changed, fieldChanges]
    }

    diff(instance, data, collections = {}) {
        let changed = false
        let changes = {}
        let many
        for (const [field, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
                if (val.length === 0 && instance[field].length !== 0) {
                    changes[field] = []
                    changed = true
                    continue
                }

                many = true
            }
            else {
                many = false
            }

            if (field in instance.constructor.fields) {
                const [nestedChanged, nestedChanges] = this.diffNestedModelField(
                    instance,
                    field,
                    val,
                    collections,
                    many,
                    many ? Number.isInteger(val[0]) : Number.isInteger(val))

                if (nestedChanged) {
                    changes[field] = nestedChanges
                }
            }

            else if (this[field] !== val) {
                changes[field] = val
            }
        }

        changed = Object.keys(changes).length > 0
        return [changed, changes]
    }

    async resolve(instance) {
        console.log('awaiting... ', instance._mutations)
        if (instance._mutations && instance._mutations.length) {
            await Promise.all(instance._mutations)
        }
        instance._mutations = []
        return instance
    }

    sync(instance, data, collections = {}) {
        // Takes a data response and sets those attributes in the model
        // NOTE: does not handle nested CREATE,
        // only constructor() for Model handles nested CREATE
        // Also does not handle nested writes for lists of instances, only single instances

        const [changed, diffTree] = this.diff(instance, data, collections)
        if (!changed) {
            return
        }
        console.log(diffTree)

        instance.isFake = false
        instance.applyDiff(diffTree)
    }

    resolveChildren(parentInstance, _modelField, getter, _collections, instance) {
        const collections = {..._collections, ...this.collections}

        const [modelField, key] = Array.isArray(_modelField)
              ? [_modelField.slice(-1), _modelField.join('.')]
              : [_modelField, _modelField]

        const value = getNestedValue(parentInstance, key)

        if (Array.isArray(value)) {
            if (value.length === 0) {
                return []
            }

            const _getter = value[0].constructor.parentResource === parentInstance.constructor.resource
                  ? (id, instance) => getter(parentInstance.id, id, collections, instance)
                  : (id, instance) => getter(id, collections, instance)

            return value.filter((instance) => {
                if (!instance.instance) {
                    const collection = this.getNestedCollection(modelField, instance, collections)
                    if (collection instanceof Promise) {
                        // The instance's collection has not been resolved yet
                        collection.then((collectionVal) => {
                            this.collections[modelField] = collectionVal
                            if (instance.isFake) {
                                collections[modelField].fetchInstance(instance, {}, () => _getter(instance.id, instance))
                            }
                        })
                        return false
                    }
                    // Try to get an instance
                    instance = collection.getInstance(instance, collections)
                }
                return instance.instance._isFake
            }).map((instance) => {
                //console.log(instance.id)
                return collections[modelField].fetchInstance(instance, {}, () => _getter(instance.id, instance))
            })
        }
        else if (value.instance._isFake) {
            const _getter = value.constructor.parentResource === parentInstance.constructor.resource
                  ? (id, instance) => getter(parentInstance.id, id, instance, collections, instance)
                  : (id, instance) => getter(id, instance, collections, instance)

            return [collections[modelField].fetchInstance(instance, {}, () => _getter(value.id, value))]
        }
        return []
    }
}

export class Model {

    static initialState = {}
    static fields = {}
    static fieldConverters = {}

    constructor(instance, collections = {}) {
        this.instance = {...instance}

        for (const field of Object.keys(this.constructor.initialState)) {
            // No empty members!
            if (this.instance[field] === null || this.instance[field] === undefined) {
                // This is a partial instance
                if (Array.isArray(this.constructor.initialState[field])) {
                    this.instance[field] = []
                }
                else if (field in this.constructor.fields) {
                    this.instance[field] = { id: 0, instance: { _isFake: true } }
                }
                else {
                    this.instance[field] = this.constructor.initialState[field]
                }
                // continue
            }

            if (field in this.constructor.fields) {
                if (this.instance[field].id !== 0 && collections[field] !== undefined) {
                    // Initialize an model instance(s)
                    this.resolveNestedModelField(field, collections)
                }
                else if (!this.instance._isFake && (!this.instance[field].instance || !this.instance[field].instance._isFake)) {
                    console.log(`WARNING: non-fake Model instance field ${field} is missing from collections!`)
                }
            }
            // Convert the field if there is a conversion function specified for this field
            else if (field in this.constructor.fieldConverters) {
                this.instance[field] = this.constructor.fieldConverters[field](this.instance[field])
                Object.defineProperty(this, field, {
                    get: () => { return this.instance[field] },
                    set: (val) => { this.instance[field] = this.constructor.fieldConverters[field](val) }
                })
                continue
            }

            Object.defineProperty(this, field, {
                get: () => { return this.instance[field] },
                set: (val) => { this.instance[field] = val }
            })
        }
    }

    resolveNestedModelField(field, collections = {}) {
        // Single primary key or instance case
        if (Number.isInteger(this.instance[field]) || Number.isInteger(this.instance[field].id)) {
            if (collections[field] instanceof Promise) {
                // This is a deferred collection
                collections[field].then((collection) => {
                    this.instance[field] = collection.getInstance(this.instance[field], {...collections, [field]: collection})
                })
            }
            else {
                this.instance[field] = collections[field].getInstance(this.instance[field], collections)
            }
        }
        // Multiple instances or multiple primary keys
        else if (Array.isArray(this.constructor.fields[field])) {
            if (collections[field] instanceof Promise) {
                collections[field].then((collection) => {
                    this.instance[field] = collection.getInstances(this.instance[field], {...collections, [field]: collection})
                })
            }
            else {
                this.instance[field] = collections[field].getInstances(this.instance[field], collections)
            }
        }
        else {
            throw new Error('Invalid model field instantiation: model field is neither a pk, object, nor an array')
        }
    }

    set isFake(value) {
        if (value === false) {
            // This instance is populated with data and is thus now a real instance
            delete this.instance._isFake
        }
        else {
            this.instance.isFake = value
        }
    }

    static isInstance(instance) {
        return instance instanceof this.constructor
    }

    applyDiff(diff) {
        for (const [field, val] of Object.entries(diff)) {
            this[field] = typeof val === 'function'
                ? val()
                : val
        }
    }

    getForm(parent = null) {
        const form = {}
        // Deep copy
        for (const field of Object.keys(this.constructor.initialState)) {
            // No empty members!
            if (this[field] === null || this[field] === undefined) {
                continue
            }

            // Get the model's serialized form
            // NOTE: we retain arrays as list of Model instances for now
            if (field in this.constructor.fields && !Array.isArray(this[field])) {
                // Skip for recursive relations
                if (parent !== null && this[field].id === parent.id && parent.typeCheck(this[field])) {
                    continue
                }
                // Make sure recursive relations aren't resolved deeply
                if (this[field] instanceof Model) {
                    form[field] = this[field].getForm({
                        id: this.instance.id, typeCheck: this.constructor.isInstance.bind(this)
                    })
                }
            }

            else {
                form[field] = this[field]
            }
        }
        return form
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
