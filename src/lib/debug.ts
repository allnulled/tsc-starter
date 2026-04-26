export default function debug (item:any, params:string = "") {
  let output = item;
  if(typeof item === "object") {
    params.split(",").forEach(param => {
      if(param.startsWith("-")) {
        const prop = param.substr(1);
        output = Object.assign({}, item);
        delete output[prop];
      }
    });
  }
  console.log(output);
}