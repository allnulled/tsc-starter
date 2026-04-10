import hello from "./methods/hello.ts";
import goodbye from "{src}/lib/methods/goodbye.ts";
import clap from "{root}/src/lib/methods/clap.ts";

class Class1 {
    static hello = hello;
    static goodbye = goodbye;
    static clap = clap;
    static sum(a:number, b:number):void {
        console.log(a + b);
    }
    static markup():any {
        return source`fichero.html`;
    }
}

export default Class1;