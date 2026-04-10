var hello = () => console.log("Hello");

var goodbye = () => console.log("Goodbye");

class Class1 {
  static hello = hello;
  static goodbye = goodbye;
  static sum(a, b) {
    console.log(a + b);
  }
  static markup() {
    return "Esto es un string cogido de un fichero.";
  }
}

Class1.hello();
Class1.sum(800, 600);
Class1.sum(800, 600);
Class1.sum(800, 600);
console.log(Class1.markup());
