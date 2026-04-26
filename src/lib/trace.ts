let isTracing:boolean = true;

export default function trace (identity:string, args:any):void {
  if(isTracing) {
    console.log(`[trace] [${identity}] ${Array.from(args || []).map(el => typeof el).join(",")}`);
  }
}