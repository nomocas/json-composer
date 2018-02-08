/* global describe, it, expect, afterEach */
/* eslint no-console:0 */
const Composer = require('../src/index');
const path = require('path');


const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
/* istanbul ignore next */
async function readJSON(jsonPath) {
	try {
		const content = await readFile(jsonPath, 'utf8');
		return JSON.parse(content);
	} catch (e) {
		console.error('Error while parsing : ', e); // eslint-disable-line no-console
	}
}

async function resolver(cwd, filePath) {
	const fp = path.resolve(cwd, filePath);
	return Composer.extend(await readJSON(fp), fp, resolver);
}

// try {
// 	resolver(__dirname, './composed.json')
// 		.then(r => console.log('extended', r))
// 		.catch(e => console.error('error', e));
// } catch (e) {
// 	console.error('error', e);
// }



describe('composition through fs', () => {

	const composedPath = path.resolve(__dirname, './composed.json');
	afterEach(() => {});

	describe('should bind click event', () => {
		it('set exactly one event', () => {
			return Composer.extend({
				">>foo": "./bar.json",
				hello: "world"
			}, composedPath, resolver)
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
			}, composedPath, resolver)
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
			}, composedPath, resolver)
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
