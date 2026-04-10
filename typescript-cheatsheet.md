Vale, aquí tienes **TODO unificado, limpio, sin duplicados y con patrón consistente** 👇

---

# 🧱 PRIMITIVOS

```ts
number
string
boolean
bigint
symbol
null
undefined
```

```ts
let a: number = 5
let b: string = "hola"
let c: boolean = true
let d: bigint = 10n
let e: symbol = Symbol("id")
let f: null = null
let g: undefined = undefined
```

---

# 📦 ESPECIALES

```ts
any
unknown
void
never
```

```ts
let x: any = 5
x = "lo que sea"

let y: unknown = 5
if (typeof y === "number") console.log(y + 1)

function log(): void {}

function fail(): never {
  throw new Error("boom")
}
```

---

# 🧩 OBJETOS

```ts
object

{ a: number, b: string }

{
  a: number
  b?: string
  readonly c: number
}
```

```ts
let obj: { a: number, b?: string } = { a: 1 }

let obj2: { readonly a: number } = { a: 1 }
```

---

# 📚 ARRAYS

```ts
number[]
Array<number>

readonly number[]
ReadonlyArray<number>
```

```ts
let arr1: number[] = [1,2,3]
let arr2: Array<string> = ["a","b"]
```

---

# 🧠 TUPLAS

```ts
[number, string]
[number, string?]
[number, ...string[]]
```

```ts
let t1: [number, string] = [1, "a"]
let t2: [number, string?] = [1]
let t3: [number, ...string[]] = [1, "a", "b"]
```

---

# 🔀 UNION

```ts
number | string
"a" | "b" | "c"
```

```ts
let u: number | string = 5
u = "hola"
```

---

# 🔒 INTERSECTION

```ts
A & B
```

```ts
type A = { a: number }
type B = { b: string }

let i: A & B = { a: 1, b: "x" }
```

---

# 🧪 TYPE

```ts
type ID = number | string
```

```ts
type ID = number | string
let id: ID = "abc"
```

---

# 🧬 INTERFACE

```ts
interface User {
  name: string
  age: number
}
```

```ts
interface User {
  name: string
}

let user: User = { name: "Juan" }
```

---

# 🧮 FUNCIONES

```ts
(a: number, b: number) => number
() => void
```

```ts
let fn: (a: number, b: number) => number = (a,b) => a + b
```

---

# 🧩 FUNCIONES EN OBJETOS

```ts
{
  fn: (a: number) => string
}
```

```ts
let objFn = {
  fn: (a: number): string => a.toString()
}
```

---

# 🧠 GENERICS

```ts
type Box<T> = T
function fn<T>(x: T): T
```

```ts
function id<T>(x: T): T {
  return x
}

id<number>(5)
id("hola")
```

---

# 📚 ARRAY GENÉRICO

```ts
Array<T>
T[]
```

```ts
let nums: Array<number> = [1,2,3]
```

---

# 🗺️ RECORD

```ts
Record<string, number>
Record<"a" | "b", number>
```

```ts
let map: Record<string, number> = {
  a: 1,
  b: 2
}
```

---

# 🔑 INDEX SIGNATURE

```ts
{
  [key: string]: number
}
```

```ts
let dict: { [key: string]: number } = {
  a: 1,
  b: 2
}
```

---

# 🧪 TYPEOF

```ts
type T = typeof obj
```

```ts
const obj = { a: 1 }
type T = typeof obj
```

---

# 🔍 KEYOF

```ts
type K = keyof T
```

```ts
type K = keyof { a: number, b: string }
```

---

# 📦 UTILITY TYPES

```ts
Partial<T>
Required<T>
Readonly<T>
Pick<T, "a" | "b">
Omit<T, "a">
```

```ts
type T = { a: number, b: string }

type P = Partial<T>
type R = Required<T>
type RO = Readonly<T>
type PK = Pick<T, "a">
type O = Omit<T, "a">
```

---

# 🔁 OVERLOAD

```ts
function fn(a: number): number
function fn(a: string): string
```

```ts
function fn(a: number): number
function fn(a: string): string
function fn(a: any): any {
  return a
}
```

---

# 🧨 UNION PARAM

```ts
function fn(a: number | string) {}
```

---

# 🧠 TYPE GUARDS

```ts
typeof x === "string"
"prop" in obj
```

```ts
function fn(x: number | string) {
  if (typeof x === "string") {
    console.log(x.toUpperCase())
  }
}
```

---

# 🧩 PROMISE

```ts
Promise<number>
```

```ts
let p: Promise<number> = Promise.resolve(5)
```

---

# 🔗 CALLBACK

```ts
(fn: (x: number) => void) => void
```

```ts
function run(cb: (x: number) => void) {
  cb(5)
}
```

---

# 🔥 LITERAL TYPES

```ts
let a: 1
let b: "hola"
```

```ts
let a: "hola" = "hola"
```

---

# 🧊 AS CONST

```ts
const x = { a: 1 } as const
```

```ts
const objConst = { a: 1 } as const
```

---

# 🧠 SATISFIES

```ts
const obj = { a: 1 } satisfies { a: number }
```

---

# 🧩 RESUMEN

```ts
|  // union
&  // intersection
[] // array
<T> // generic
() => // función
{} // objeto
```

---

Perfecto, siguiente nivel **ultra condensado** 👇

---

# 🔀 CONDITIONAL TYPES

```ts
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

---

# 🧠 INFER (extraer tipos)

```ts
type Return<T> = T extends (...args: any[]) => infer R ? R : never

type R = Return<() => number>  // number
```

---

# 📦 EXTRAER PARAMS

```ts
type Params<T> = T extends (...args: infer P) => any ? P : never

type P = Params<(a: number, b: string) => void>  
// [number, string]
```

---

# 🔁 DISTRIBUTIVE (con unions)

```ts
type ToArray<T> = T extends any ? T[] : never

type R = ToArray<number | string>  
// number[] | string[]
```

---

# 🧩 MAPPED TYPES

```ts
type MyType = {
  a: number
  b: string
}

type ReadonlyT = {
  [K in keyof MyType]: MyType[K]
}
```

---

# 🔒 MAPPED + MODIFIERS

```ts
type Optional<T> = {
  [K in keyof T]?: T[K]
}

type RequiredT<T> = {
  [K in keyof T]-?: T[K]
}
```

---

# 🔁 KEY REMAPPING

```ts
type Prefix<T> = {
  [K in keyof T as `pre_${string & K}`]: T[K]
}
```

---

# 🧠 FILTER KEYS

```ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
```

---

# 🔥 TEMPLATE LITERALS

```ts
type Event = "click" | "hover"

type Handler = `on${Capitalize<Event>}`
// "onClick" | "onHover"
```

---

# 🧬 RECURSIVE TYPES

```ts
type Nested = {
  value: number
  next?: Nested
}
```

---

# 🧠 DEEP PARTIAL

```ts
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}
```

---

# 🧨 NEVER FILTRO

```ts
type Without<T, U> = T extends U ? never : T

type R = Without<string | number, string>
// number
```

---

# 🔍 EXTRACT / EXCLUDE

```ts
type A = Extract<string | number, string> // string
type B = Exclude<string | number, string> // number
```

---

# 🧠 NONNULLABLE

```ts
type T = NonNullable<string | null | undefined>
// string
```

---

# 📦 RETURN TYPE (built-in)

```ts
type R = ReturnType<() => number>
```

---

# 📚 INSTANCE TYPE

```ts
class A {}

type T = InstanceType<typeof A>
```

---

# 🧠 THIS TYPE

```ts
function fn(this: { x: number }) {
  console.log(this.x)
}
```

---

# 🔁 SATISFIES (pro tip real)

```ts
const routes = {
  home: "/",
  about: "/about"
} satisfies Record<string, string>
```

👉 valida SIN perder tipos literales

---

# 💀 COSAS POTENTES COMBINADAS

```ts
type API<T> = {
  [K in keyof T]: (arg: T[K]) => Promise<T[K]>
}
```

---


# 🧠 `extends` → condición

Sirve para hacer lógica tipo *if* en tipos.

```ts
type IsString<T> = T extends string ? true : false

type A = IsString<string>  // true
type B = IsString<number>  // false
```

👉 “si T es string → true, si no → false”

---

# 🧠 `infer` → extraer tipos

Sirve para “capturar” partes de un tipo.

```ts
type GetReturn<T> = T extends (...args: any[]) => infer R ? R : never

type R = GetReturn<() => number>  // number
```

👉 “si es función → sácame lo que devuelve”

---

# 🧠 `keyof` → claves de un objeto

```ts
type Keys = keyof { a: number, b: string }
// "a" | "b"
```

👉 convierte propiedades en union

---

# 🧠 `[K in ...]` → loop de tipos (mapped types)

Recorre claves como si fuera un `for`

```ts
type T = { a: number, b: string }

type Copy = {
  [K in keyof T]: T[K]
}
```

👉 crea un tipo nuevo iterando claves

---

# 🧠 `as` → renombrar o filtrar claves

## renombrar

```ts
type Prefix<T> = {
  [K in keyof T as `pre_${string & K}`]: T[K]
}
```

---

## filtrar

```ts
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
```

👉 si devuelve `never`, se elimina la clave

---

# 🧠 `` `${}` `` → strings dinámicos (template literals)

```ts
type Event = "click" | "hover"

type Handler = `on${Capitalize<Event>}`
// "onClick" | "onHover"
```

👉 construyes strings a nivel de tipo

---

# 🧠 `never` → eliminar / imposible

## eliminar en unions

```ts
type Without<T, U> = T extends U ? never : T

type R = Without<string | number, string>
// number
```

---

## eliminar en mapped types

```ts
type RemoveA<T> = {
  [K in keyof T as K extends "a" ? never : K]: T[K]
}
```

👉 `never` = desaparece

---

# 🧩 TODO JUNTO (ejemplo real)

```ts
type API<T> = {
  [K in keyof T as T[K] extends Function ? K : never]:
    T[K] extends (...args: any[]) => infer R
      ? (...args: any[]) => Promise<R>
      : never
}
```

👉 esto hace:

* recorre claves (`[K in keyof T]`)
* filtra funciones (`extends Function`)
* extrae retorno (`infer R`)
* lo transforma (`Promise<R>`)

---

# 🧠 TL;DR real (bien dicho)

* `extends` → if en tipos
* `infer` → sacar partes internas
* `keyof` → obtener claves
* `[K in ...]` → iterar propiedades
* `as` → cambiar o eliminar claves
* `` `${}` `` → construir strings
* `never` → borrar o descartar

---
