export function isPrimitive(target) {
    return typeof target !== 'object' || target === null;
}

export function deepEqual(x, y) {
    if (!isPrimitive(x) && !isPrimitive(y)) {
        if (Object.keys(x).length !== Object.keys(y).length) {
            return false;
    }

        for (let prop in x) {
            if (y.hasOwnProperty(prop)) {
                if (!deepEqual(x[prop], y[prop])) {
                    return false;
                }
            } else {
                return false;
            }
        }

        return true;
    } else {
        return x === y;
    }
}
