/* global describe, it, expect, afterEach */
/* eslint no-console:0 */
const Composer = require('../src/index');
const path = require('path');
const cloneDeep = require('lodash.clonedeep');
const fixtures = {
	'/composed.json': {
		">>foo": "./bar.json",
		hello: "world"
	},
	'/bar.json': {
		zoo: 'bidoo',
		bloupi: {
			'>>': ['./bru.json', './bro.json']
		}
	},
	'/bru.json': {
		bru: true
	},
	'/bro.json': {
		bro: 1234
	}
};

function resolver(cwd, filePath) {
	const fp = path.resolve(cwd, filePath);
	if (!fixtures[fp])
		throw new Error('missing fixture ressource : ' + fp);
	return Promise.resolve(Composer.extend(cloneDeep(fixtures[fp]), fp, resolver));
}

describe('composition through fixtures', () => {

	afterEach(() => {});

	describe('should bind click event', () => {
		it('set exactly one event', () => {
			return Composer.extend({
				">>foo": "./bar.json",
				hello: "world"
			}, '/composed.json', resolver)
				.then(json =>
					expect(json)
					.toEqual({
						hello: "world",
						foo: {
							zoo: "bidoo",
							bloupi: {
								bru: true,
								bro: 1234
							}
						}
					})
				);
		});
	});


	describe('should bind click event', () => {
		it('set exactly one event', () => {
			return Composer.extend({
				">>": "./bar.json",
				hello: "world"
			}, '/composed.json', resolver)
				.then(json =>
					expect(json)
					.toEqual({
						hello: "world",
						zoo: "bidoo",
						bloupi: {
							bru: true,
							bro: 1234
						}
					})
				);
		});
	});

	describe('should bind click event', () => {
		it('set exactly one event', () => {
			return Composer.extend({
				">>": ["./bar.json"],
				hello: "world"
			}, '/composed.json', resolver)
				.then(json =>
					expect(json)
					.toEqual({
						hello: "world",
						zoo: "bidoo",
						bloupi: {
							bru: true,
							bro: 1234
						}
					})
				);
		});
	});
});
