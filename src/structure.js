function structure(schema, options) {
    if (typeof schema !== 'object') throw "Invalid argument"
    if (['object', 'undefined'].indexOf(typeof options) === -1) throw "Invalid argument"
    options = rollup(validation.defaults, options)
    return function(object) {
        let errors = []
        validate(object, schema, options, errors)
        return !(errors.length)
    }
}
const validation = {}
validation.defaults = {}
validation.messages = {}

function rollup() {
    let obj = {}
    let sources = Array.prototype.slice.apply(arguments)
    while (sources.length) {
        const source = sources.shift()
        if (!source) continue

        if (typeof(source) !== 'object') {
            throw new TypeError('non-object passed to rollup')
        }

        for (const p in source) {
            if (source.hasOwnProperty(p)) {
                obj[p] = source[p]
            }
        }
    }
    return obj
}

function validate(object, schema, options, errors) {
    for (const prop in schema) {
        if (schema.hasOwnProperty(prop)) {
            validateProperty(object, object[prop], prop, schema[prop], options, errors)
        }
    }
}

function validateProperty(object, value, property, schema, options, errors) {
    if (typeof value === 'undefined') {
        if (schema.required && schema.type !== 'any') {
            errors.push({
                attribute: 'required',
                property: property,
                expected: schema,
                actual: undefined
            })
            return
        } else {
            return
        }
    }

    if (checkType(value, schema.type)) {
        return
    } else {
        errors.push({
                attribute: 'type',
                property: property,
                expected: schema.toString(),
                actual: typeof value
        })
        return
    }
}

function checkType(value, type) {
    if (typeof type === 'undefined') return true
    const types = isArray(type) ? type : [type]
    for (let i = 0; i < types.length; i++) {
        type = types[i].toLowerCase().trim()
        switch (type) {
            case 'string':
                if (typeof value === 'string') return true
                break
            case 'array':
                if (isArray(value)) return true
                break
            case 'object':
                if (typeof value === 'object' && !isArray(value) && !isDate(value)) return true
                break
            case 'number':
                if (typeof value === 'number') return true
                break
            case 'integer':
                if (typeof value === 'number' && Math.floor(value) === value) return true
                break
            case 'null':
                if (value === null) return true
                break
            case 'boolean':
                if (typeof value === 'boolean') return true
                break
            case 'date':
                if (isDate(value)) return true
                break
            case 'any':
                if (typeof value !== 'undefined') return true
                break
        }
    }
    return false
}

function isArray(value) {
    return Object.prototype.toString.call(value) === '[object Array]'
}

function isDate(value) {
    return Object.prototype.toString.call(value) === '[object Date]'
}

export {
    structure
}
