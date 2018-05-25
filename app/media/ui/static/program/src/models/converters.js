import moment from 'moment'

export function momentDate(input) {
    return moment(input)
}

export function modelInstance(ModelType, input, collections = {}) {
    return new ModelType(input, collections)
}
