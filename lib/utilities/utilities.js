"use strict"

function utilities() {
	
}

utilities.prototype.checkAtLeastOne = function (obj, types, options) {
	options = options || {}

	let k
	let type
	let exclusionSet = options.exclusions || new Set()

	for (k in types) {
		if (types.hasOwnProperty(k)) {
			type = typeof obj[k]

			if (type !== "undefined" && !exclusionSet.has(k)) {
				return true
			}
		}
	}

	return false
}

//checks if required and optional fields are both the correct type
//and their strings and objects are not empty
utilities.prototype.checkFields = function (obj, types, options) {
	options = options || {}

	if (obj === undefined || types === undefined) {
		throw new Error("arguments obj and types must have a value")
	} else if (typeof obj !== "object" || typeof types !== "object") {
		throw new Error("obj, types must be of type object")
	} else if (types.required === undefined || typeof types.required !== "object") {
		throw new Error("types object must contain required field with value of type object")
	} else if (types.optional !== undefined && typeof types.optional !== "object") {
		throw new Error("optional field must have value of type object")
	}

	let allTypes = {}
	let exclusions = options.exclusions
	let type
	let content
	let str


	//MISSING AND TYPE CHECK

	//checks all type keys are in fields
	//checks known fields have proper type
	//ignores unknown fields
	type = this.checkTypes(obj, types.required, {exclusions: exclusions})

	if (type !== undefined) {
		if (type.is === undefined) {
			str = "No " + type.key + " in the request"
		} else {
			str = type.key + " should be of type " + type.shouldBe + ", but is of type " + type.is + " instead"
		}
	} else {
		content = this.checkContent(obj, types.required, {exclusions: exclusions})

		if (content !== undefined && str === undefined) {
			str = content.key + " is invalid because it is " + content.is
		}
	}

	// TYPE CHECK

	if (types.optional && str === undefined) {

		//checks all type keys are in fields
		//checks known fields have proper type
		//ignores unknown fields
		//ignores undefined fields
		type = this.checkTypes(obj, types.optional, {exclusions: exclusions, skipUndefined: true})

		if (type !== undefined && str === undefined) {
			str = type.key + " should be of type " + type.shouldBe + ", but is of type " + type.is + " instead"
		}

		content = this.checkContent(obj, types.optional, {exclusions: exclusions, skipUndefined: true})

		if (content !== undefined && str === undefined) {
			str = content.key + " is invalid because it is " + content.is
		}
	}



	//UNKNOWN CHECK

	if (types.optional && str === undefined) {

		//changes target object, which is the first arg
		Object.assign(allTypes, types.required, types.optional)

		//checks fields are known
		type = this.checkForUnknown(obj, allTypes, {exclusions: exclusions})

		if (type !== undefined) {
			str = type.key + " is an unknown field"
		}
	}


	return str
}

utilities.prototype.checkForUnknown = function (obj, types, options) {
	options = options || {}

	let k
	let exclusionSet = options.exclusions || new Set()

	for (k in obj) {
		if (obj.hasOwnProperty(k)) {

			if (types[k] === undefined && !exclusionSet.has(k)) {
				return {
					key: k
				}
			}
		}
	}

	return
}

//checks if key values are the proper type
utilities.prototype.checkTypes = function (obj, types, options) {
	options = options || {}

	let k
	let type
	let count = 0
	let skipUndefined = options.skipUndefined || false
	let exclusionSet = options.exclusions || new Set()
	let atLeastOne = options.atLeastOne || false

	for (k in types) {
		if (types.hasOwnProperty(k)) {
			type = typeof obj[k]

			if (type === "string" && types[k] === "uuid") {
				type = "uuid"
			} else if (type === "object" && types[k] === "array" && Array.isArray(obj[k])) {
				type = "array"
			}

			//Note: will match undefined
			//this is intentional
			if (types[k] !== type && !exclusionSet.has(k)) {
				if (type === "undefined" && skipUndefined) {
					continue
				} 

				return {
					key: k,
					is: type,
					shouldBe: types[k],
					atLeastOne: true
				}

			//check if NaN, since it is of type "number"
			} else if (type === "number" && isNaN(obj[k]) && !exclusionSet.has(k)) {
				return {
					key: k,
					is: type,
					shouldBe: types[k],
					atLeastOne: true
				}
			}
		}

		count++
	}
	

	if (atLeastOne && count === 0) {
		return {
			key: "",
			is: "",
			shouldBe: "",
			atLeastOne: false
		}
	}

	return
}

//checks if string or object is empty
utilities.prototype.checkContent = function (obj, types, options) {
	options = options || {}

	let k
	let type
	let skipUndefined = options.skipUndefined || false
	let exclusionSet = options.exclusions || new Set()

	for (k in types) {
		if (types.hasOwnProperty(k)) {
			type = typeof obj[k]

			if (type === "string" && types[k] === "uuid") {
				type = "uuid"
			} else if (type === "object" && types[k] === "array" && Array.isArray(obj[k])) {
				type = "array"
			}

			//Note: will match undefined
			//this is intentional
			if (types[k] !== type && !exclusionSet.has(k)) {
				if (type === "undefined" && skipUndefined) {
					continue
				}

				return {
					key: k,
					is: "wrong type"
				}

			//check if strings are empty
			} else if (type === "string" && (obj[k] === "" || obj[k].trim() === "") && !exclusionSet.has(k)) {
				return {
					key: k,
					is: "empty"
				}
			
			}  else if (type === "object" &&  this.isEmpty(obj[k]) && !exclusionSet.has(k) && !skipUndefined) {
				return {
					key: k,
					is: "empty"
				}
			}
		}
	}

	return
}

utilities.prototype.isEmpty = function (obj) {
if (obj === undefined) {
		return true
	}

	//null is of type object
	if (typeof obj !== "object" && obj !== null) {
		throw new Error("argument must be an object")
	}

	let key

	// Assume if it has a length property with a non-zero value
	// that that property is correct.
	if (obj.length !== undefined) {
		if (obj.length > 0) {
			return false
		} else if (obj.length === 0) {
			return true
		}
	}

	// Otherwise, does it have any properties of its own?
	for (key in obj) {
		if (hasOwnProperty.call(obj, key)) {
			return false
		}
	}

	return true
}


module.exports = new utilities()
