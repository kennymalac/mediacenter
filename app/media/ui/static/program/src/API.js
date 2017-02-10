var API_ROOT = '/api';

function getFormData(formSelector) {
    return $(formSelector).serializeArray().reduce(function (obj, item) {
        obj[item.name] = item.value;
        return obj;
    }, {});
}
