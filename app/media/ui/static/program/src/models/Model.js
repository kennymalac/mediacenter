export function serializeIds(values) {
    return values.map((val) => { return val.instance.id })
}

export function serializeForms(values) {
    return values.map((val) => { return val.getForm() })
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
                // NOTE assumes that Collection is up-to-date
                // Initialize an array of model instances
                const store = collections[field]
                if (store instanceof this.constructor.fields[field]) {
                    const ids = Number.isInteger(this.instance[field])
                          ? this.instance[field]
                          : this.instance[field].map((val) => { return val.id })
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

    sync(data, form) {
        // Takes a data response and sets those attributes in the model
        // NOTE: does not handle nested CREATE,
        // only constructor() for Model handles nested CREATE
        // Also does not handle nested writes for lists of instances, only single instances

        for (const [field, val] of Object.entries(data)) {
            if (this[field] instanceof Model) {
                // handle single primary key case
                if (Number.isInteger(val)) {
                    if (val === this[field].id) {
                        // The entry has not changed, so retain the current field model instance in place
                        continue
                    }
                    // TODO - form does not have the instance
                    throw new Error('Improper Data model as serialized! No matching Model instance for pk found. Expected object, not pk')
                }
                // this must be a value
                else {
                    // NOTE only handles nested relations 2 levels deep
                    // TODO fix?
                    this[field].sync(val, form[field])
                }
                continue
            }
            // handle list of Models and ids
            if (Array.isArray(val) && val.length >= 1) {
                // Ids
                if (Number.isInteger(val[0])) {
                    // TODO "deferred" nested pks
                    // Form has the list of real instances of this
                    this[field] = form[field]
                }
                // Serialized instances
                else if (form[field][0] instanceof Model) {
                    // Form has the instances
                    this[field] = form[field]
                }
                else {
                    throw new Error(`Invalid form! Form must contain list of instances for field: ${field}`)
                }
                continue
            }

            this[field] = val
        }
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
            console.log(field, this[field], this[field] instanceof Model)

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
