const bottom = require('lodash.defaultsdeep');
const up = require('lodash.merge');
const assert = require('assert');
const path = require('path');
const debug = require('debug')('json-composer');

function applyJson(descriptor) {
	if (descriptor.key === '>>') {
		let value = descriptor.value;
		if (descriptor.fromArray)
			value = up({}, ...value);
		bottom(descriptor.json, value);
	} else
		descriptor.json[descriptor.key] = descriptor.value;
}

class JsonComposer {
	constructor(filePath, resolver) {
		assert(typeof resolver == 'function', 'JsonComposer need a resolver function at constructor time');
		this.filePath = filePath;
		this.fileDir = path.dirname(filePath);
		this.resolver = resolver;
		this.promises = [];
	}
	
	findPointer(json) {
		debug('findPointer : ', json);
		Object.keys(json)
			.forEach(key => {
				if (key.indexOf('>>') === 0)
					this.loadPointer(json, key, json[key]);
				else if (typeof json[key] === 'object' && json[key])
					this.findPointer(json[key]);
			});
	}

	loadPointer(json, key, jsonPath) {
		debug('loadPointer : ', json, key, jsonPath);
		const descriptor = {
			json,
			key: (key.length > 2) ? key.substring(2) : key
		};
		let promise;
		if (Array.isArray(jsonPath)) {
			descriptor.fromArray = true;
			promise = Promise.all(jsonPath.map(p => this.resolver(this.fileDir, p)));
		} else
			promise = this.resolver(this.fileDir, jsonPath);

		this.waiting(promise.then(result => {
			delete json[key];
			descriptor.value = result;
			return descriptor;
		}));
	}

	waiting(promise) {
		debug('waiting');
		this.promises.push(promise);
	}

	static extend(json, filePath, resolver) {
		debug('extend', json, filePath);
		const report = new JsonComposer(filePath, resolver);
		report.findPointer(json);
		return Promise.all(report.promises)
			.then(loaded => {
				loaded.forEach(applyJson);
				return json;
			});
	}
}

module.exports = JsonComposer;
