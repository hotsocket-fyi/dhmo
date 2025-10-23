/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

import { Err, Ok, Result } from "./mod.ts";
import { assert, assertEquals } from "@std/assert";

Deno.test("result: basic ok/err", () => {
	const x: Result<number, string> = Ok(-3);
	assert(x.ok);

	const y: Result<number, string> = Err("Some error message");
	assert(!y.ok);
});

Deno.test("result: okValue", () => {
	let x: Result<number, string> = Ok(2);
	assertEquals(x.okValue(), 2);

	x = Err("Nothing here");
	assertEquals(x.okValue(), undefined);
});

Deno.test("result: errValue", () => {
	let x: Result<number, string> = Ok(2);
	assertEquals(x.errValue(), undefined);

	x = Err("Nothing here");
	assertEquals(x.errValue(), "Nothing here");
});

Deno.test("demo", () => {
	function stringToNumberThrows(str: string): number {
		const int = Number.parseInt(str);
		if (!int) throw new Error("SOMETHING BAD HAPPENED");
		else return int;
	}

	const myNumber = Result.from(() => stringToNumberThrows("200"));

	console.log(myNumber.okValue()); // 200
	console.log(myNumber.errValue()); // undefined

	const willError = Result.from(() => stringToNumberThrows("ABCDEFG"));

	console.log(willError.okValue()); // undefined
	console.log(willError.errValue()?.name); // Error
});
