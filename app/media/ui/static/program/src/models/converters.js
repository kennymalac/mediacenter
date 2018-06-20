import moment from 'moment'

export function momentDate(input) {
    if (input === null) {
        return {}
    }
    return moment(input)
}

export function modelInstance(ModelType, input, collections = {}) {
    return new ModelType(input, collections)
}
