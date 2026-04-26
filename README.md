# libs-compiler

Bundler dinámico de módulos JS hecho en TS.

## Base

La base funcional del proyecto es la misma que en el proyecto:

- [https://github.com/allnulled/tsc-starter](https://github.com/allnulled/tsc-starter).

La diferencia es que partimos de tener un compilador para usar en runtime.

## Uso

Para compilar:

```js
const compilation = await Compiler.create("basedir/of/modules").compile("/path/to/entry.js");

console.log(compilation.output.js);
```

Para importar:

```js
const val1 = Libs.require("path/to/importable.js");
const val2 = await Libs.require("path/to/asynchronous/importable.js");
```

Para exportar:

```js
module.exports = function() {
   console.log("This module exported a function");
}
```

## Ficheros

- en el `dist/main.js` está el compilador
- en el `src/main.ts` empieza el compilador

## ¿Por qué?

- TypeScript permite código JavaScript
- Pero un bundler en runtime desde el navegador que use TypeScript sería excesivo
- Esta pequeña API permite tener un bundler en runtime desde el navegador que NO usa TypeScript
   - Pero puedes tener tus `*.ts` para fabricar los bundleables igual
      - (Que es el siguiente punto del proyecto)


