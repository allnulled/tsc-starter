# tsc-starter

Proyecto preconfigurado para usar typescript.

No usa `tsc` por eso, usa `rollup` + `babel`.

## Instalación

```sh
git clone ...
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
- `/test/`: los tests
- `rollup.config.js`: configuraciones de `rollup`
- `tsconfig.config.js`: configuraciones de `typescript` (afecta a `vscode` también)

## Plugins incorporados

### sourceToString.js

Permite inyectar ficheros en formato String con solo:

```js
console.log(source`ruta/a/fichero.txt`);
```

