# tsc-starter

![babel](https://static.platzi.com/blog/uploads/2017/01/babel-3.jpg)

Proyecto preconfigurado para usar typescript.

No usa `tsc` por eso, usa `rollup` + `babel`.

## Instalación

```sh
git clone https://github.com/allnulled/tsc-starter.git .
npm install
```

## Uso

```sh
npm run build # fabrica el dist
npm run test  
npm run dev   # inicia el loop
```

## Ficheros y carpetas clave

- `/dist/`: los distribuibles (o compilados a js)
- `/src/`: los fuentes
   - `/src/*.ts`: los entries
   - `/src/lib/*`: los módulos
- `/commands/`: los comandos `npm run *`
   - `/commands/utils/roolup-plugins`: los plugins para `rollup`
   - `/commands/build.js`: aquí está en inline el `babel.config.js` y el despliegue de rollup + babel + plugins
- `/test/`: los tests
- `rollup.config.js`: configuraciones de `rollup`
- `tsconfig.config.js`: configuraciones de `typescript` (afecta a `vscode` también)

## Plugins incorporados

### @rollup/plugin-alias

- Permite tener shortcuts en los imports.
- Ahora mismo soporta:
   - `{src}/*`: empieza en `src`
   - `{root}/*`: empieza en `src/..`
- Para ampliarlos tienes que cambiar 2 ficheros:
   - `tsconfig.json`: en `compilerOptions.paths` (para vscode)
   - `commands/build.js`: en `bundle » plugins » alias » entries` (para rollup)

### @rollup/plugin-node-resolve

- Permite resolver módulos al estilo de node.js
   - Acceder a `node_modules`
- Configurado para buscar las versiones `.js` y `.ts` de la ruta si no se encuentra directamente
   - Igual está de más esta configuración.

### sourceToString.js

- Permite inyectar ficheros en formato String con solo:

```js
console.log(source`ruta/a/fichero.txt`);
```

### @babel/plugin-proposal-decorators

- Esto actúa desde el babel de dentro del rollup
- Permite decorators de TypeScript
- Va con estos parámetros del `tsconfig.json`:
   - `experimentalDecorators:true`
   - `emitDecoratorMetadata:true`