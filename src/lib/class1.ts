import hello from "./methods/hello.ts";
import goodbye from "./methods/goodbye.ts";

class Class1 {
    static hello = hello;
    static goodbye = goodbye;
    static sum(a:number, b:number):void {
        console.log(a + b);
    }
    static markup():any {
        return source`fichero.html`;
    }
}

export default Class1;