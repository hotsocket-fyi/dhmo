# DHMO

it's basically a bare-minimum knockoff of rust's
[`Result`](https://doc.rust-lang.org/std/result/enum.Result.html) thing

looks a little like this:

```ts
function stringToNumberThrows(str: string): number {
	const int = Number.parseInt(str);
	if (!int) throw new Error("SOMETHING BAD HAPPENED");
	else return int;
}

// Result.from catches errors and crams them into an Err
const myNumber = Result.from(() => stringToNumberThrows("200"));
console.log(myNumber.okValue()); // 200
console.log(myNumber.errValue()); // undefined

const willError = Result.from(() => stringToNumberThrows("ABCDEFG"));
console.log(willError.okValue()); // undefined
console.log(willError.errValue()?.name); // Error
```
