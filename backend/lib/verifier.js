const verifier = {
    exact: exact,
    atLeast: atLeast,
    atMost:atMost
}

function KeyMissingError(keys) {
    this.message = `[${keys.join(", ")}] is requied in request`
}
KeyMissingError.prototype = Error.prototype;

function KeyNotMatchError(keys) {
    this.message = `[${keys.join(", ")}] must exact contain in request`
}
KeyNotMatchError.prototype = Error.prototype;

function KeyNotSupportError(keys) {
    this.message = `invalid parameter [${keys.join(", ")}] found in request`
}
KeyNotSupportError.prototype = Error.prototype;

/**
 * @description Check if a object have the exact keys. Any object keys different with the @param keys will throw a error
 * @throws new KeyNotMatchError
 */
function exact(keys, obj) {
    if (keys.length != Object.keys(obj).length) throw new KeyNotMatchError(keys)
    keys.forEach(key => {
        if (!obj[key]) throw new KeyNotMatchError(keys)
    })
    return obj
}

/**
 * @description Check if a object have the keys speicficed. Without any speicficed keys will throw a error
 * @throws new KeyMissingError
 */
function atLeast(keys, obj) {
    const rest = keys.filter(key => !obj[key])
    if (rest.length) throw new KeyMissingError(rest)
}

/**
 * @description Check if a object have any unspecified keys. Without any unspecified keys will throw a error
 * @throws new KeyNotSupportError
 */
function atMost(keys, obj) {
    const rest = Object.keys(obj).filter(key => !keys.includes(key))
    if (rest.length) throw new KeyMissingError(rest)
}

module.exports = verifier
