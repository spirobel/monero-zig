const fs = require('fs');
const source = fs.readFileSync("./zig-out/xmr3.wasm");
const typedArray = new Uint8Array(source);

WebAssembly.instantiate(typedArray, {
  env: {
    print: (result) => { console.log(`The result is ${result}`); }
  }}).then(result => {
    console.log("exports",result.instance.exports)
  const main = result.instance.exports.main;
  console.log(main());
});
