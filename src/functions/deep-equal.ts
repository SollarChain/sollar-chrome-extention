export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (typeof obj1 !== typeof obj2) {
    return false
  }
  if (typeof obj1 !== 'object') {
    return obj1 === obj2
  }


  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      return false
    }
    return obj1.every((value, index) => deepEqual(value, obj2[index]))
  }

  if (!deepEqual(Object.keys(obj1), Object.keys(obj2))) {
    return false
  }

  for (const key in obj1) {
    if (!deepEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}
