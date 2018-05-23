export function serializeIds(values) {
    return values.map((val) => { return val.id })
}

export function serializeForms(values) {
    return values.map((val) => { return val.getForm() })
}

function mutateInstance(mutation) {
    const [instance, diff] = mutation
    const [changed, changes] = diff
    if (!changed) {
        return instance
    }

    // This instance is populated with data and is thus now a real instance
    delete instance.instance._isFake
    instance.applyDiff(changes)
    return instance
}

export async function resolve(resolutions) {
    return await Promise.all([].concat.apply([], resolutions), 0)
}

export class Collection {

    constructor(values, collections = {}) {
        this.storedIds = []
        this.store = values.map((val) => {
            this.storedIds.push(val.id)
            return new this.constructor.Model({...val}, collections)
        })

        this.values = new Proxy(this.store, {})
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
        const instance = new this.constructor.Model({...data}, collections)
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
        return values.map((instance) => this.addInstance.bind(this)(collections))
    }
}

export class Model {

    static initialState = {}
    static fields = {}
    static fieldConverters = {}

    constructor(instance, collections = {}) {
        this.instance = instance

        for (const field of Object.keys(this.constructor.initialState)) {
            // No empty members!
            if (this.instance[field] === null || this.instance[field] === undefined) {
                delete this.instance[field]
                continue
            }

            if (field in this.constructor.fields && collections[field] !== undefined) {
                // Initialize an array of model instances
                this.resolveNestedModelField(field, collections)
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
            this.instance[field] = collections[field].getInstance(this.instance[field], collections)
        }
        // Multiple instances or multiple primary keys
        else if (Array.isArray(this.constructor.fields[field])) {
            this.instance[field] = collections[field].getInstances(this.instance[field], collections)
        }
        else {
            throw new Error('Invalid model field instantiation: model field is neither a pk, object, nor an array')
        }
    }

    diffNestedModelField(field, val, collections = {}, many = false, isPrimaryKeys = false) {
        // Make sure this is a Model to begin with
        let collection
        if (this.collections && this.collections[field] instanceof Collection) {
            collection = this.collections[field]
        }
        else {
            collection = collections[field]
        }

        if (!(collection instanceof Collection)) {
            throw new Error(`Invalid model nested write! Resolved Collection for field ${field} not found.`)
        }

        let store
        let changed = false
        let fieldChanges

        if (many) {
            let instances = []

            for (let i = 0; i < val.length; i++) {
                if (this[field][i] !== val[i]) {
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
                        nestedChanges.push([instances[i], instances[i].diff(val[i], collections)])
                    }

                    // Later this will function will be called to apply all nested changes
                    fieldChanges = () => nestedChanges.map(mutateInstance)
                }
                else {
                    fieldChanges = instances
                }
            }
        }
        else if (this[field] !== val && (val !== null && this[field] !== undefined)) {
            if (isPrimaryKeys && this[field].id === val) {
                return [false]
            }
            changed = true
            store = collections[field]
            const instance = store.getInstance(val, collections, isPrimaryKeys)

            fieldChanges = !isPrimaryKeys
                ? () => mutateInstance([instance, instance.diff(val, collections)])
                : instance
        }

        return [changed, fieldChanges]
    }

    diff(data, collections = {}) {
        let changed = false
        let changes = {}
        let many
        for (const [field, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
                if (val.length === 0 && this[field].length !== 0) {
                    changes[field] = []
                    changed = true
                    continue
                }

                many = true
            }
            else {
                many = false
            }

            if (field in this.constructor.fields) {
                const [nestedChanged, nestedChanges] = this.diffNestedModelField(
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

    applyDiff(diff) {
        for (const [field, val] of Object.entries(diff)) {
            this[field] = typeof val === 'function'
                ? val()
                : val
        }
    }

    sync(data, collections = {}) {
        // Takes a data response and sets those attributes in the model
        // NOTE: does not handle nested CREATE,
        // only constructor() for Model handles nested CREATE
        // Also does not handle nested writes for lists of instances, only single instances

        const [changed, diffTree] = this.diff(data, collections)
        if (!changed) {
            return
        }
        console.log(diffTree)
        // This instance has new field data, so it's a real instance
        delete this.instance._isFake
        this.applyDiff(diffTree)
    }

    resolveChildren(modelField, getter) {
        return this[modelField].filter((instance) => {
            return instance.instance._isFake
        }).map((instance) => {
            return getter(instance.id, instance)
        })
    }

    getForm() {
        const form = {}
        // Deep copy
        for (const field of Object.keys(this.constructor.initialState)) {
            // No empty members!
            if (this[field] === null || this[field] === undefined) {
                continue
            }

            // Get the model's serialized form
            // NOTE: we retain arrays as list of Model instances for now

            form[field] = this[field] instanceof Model
                ? this[field].getForm()
                : form[field] = this[field]
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
