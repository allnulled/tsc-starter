var hello = () => console.log("Hello");

var goodbye = () => console.log("Goodbye");

var clap = () => console.log("Clap clap!");

class Class1 {
  static hello = hello;
  static goodbye = goodbye;
  static clap = clap;
  static sum(a, b) {
    console.log(a + b);
  }
  static markup() {
    return "Esto es un string cogido de un fichero.";
  }
}

var info = {
  version: "whatever"
};

Class1.hello();
Class1.sum(800, 600);
Class1.sum(800, 600);
Class1.sum(800, 600);
Class1.clap();
console.log(info.version);
console.log(Class1.markup());
