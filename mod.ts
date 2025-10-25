/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */

type _Ok<T> = { readonly ok: true; value: T };
type _Err<E> = { readonly ok: false; error: E };

type MapFn<I, O> = (val: I) => O;

type ResultBase<T, E> = {
	okValue: () => T | undefined;
	errValue: () => E | undefined;

	mapOk: <O>(mapper: MapFn<T, O>) => Result<O, E>;
	mapErr: <O>(mapper: MapFn<E, O>) => Result<T, O>;
};

function make_result<T, E>(that: _Ok<T> | _Err<E>): Result<T, E> {
	const self = that as Result<T, E>;

	self.okValue = () => (self.ok ? self.value : undefined);
	self.errValue = () => (self.ok ? undefined : self.error);

	self.mapOk = <O>(mapper: MapFn<T, O>) => {
		if (self.ok) return Ok(mapper(self.value));
		else return self as unknown as Result<O, E>;
	};
	self.mapErr = <O>(mapper: MapFn<E, O>) => {
		if (self.ok) return self as unknown as Result<T, O>;
		else return Err(mapper(self.error));
	};

	return self;
}

export type Ok<T, E> = ResultBase<T, E> & _Ok<T>;
export type Err<T, E> = ResultBase<T, E> & _Err<E>;

export type Result<T, E> = Ok<T, E> | Err<T, E>;

export const Ok = <T, E = never>(value: T): Result<T, E> =>
	make_result({ ok: true, value });

export const Err = <E, T = never>(error: E): Result<T, E> =>
	make_result({ ok: false, error });

//deno-lint-ignore no-namespace
export namespace Result {
	/** Takes a function that throws and returns the value of it or the error that was thrown */
	export function from<T>(callback: () => T): Result<T, Error> {
		try {
			return Ok(callback());
		} catch (e) {
			return Err(e as Error);
		}
	}
}
