const fs = require('fs');
const source = fs.readFileSync("./zig-out/lib/monero-zig.wasm");
const typedArray = new Uint8Array(source);

WebAssembly.instantiate(typedArray, {
  env: {
    print: (result) => { console.log(`The result is ${result}`); }
  }}).then(result => {
  const add = result.instance.exports.add;
  const minus = result.instance.exports.minus;
  console.log(add(1, 2));
  console.log(minus(10,5));
});
