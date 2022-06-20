# monero-zig
build and run:
```bash
zig build
node test
```
Building the project to run in web browsers requires the Emscripten SDK to provide
a sysroot and linker :
```bash
# install emsdk into a subdirectory
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk
./emsdk install latest
./emsdk activate latest
cd ..

```
# credits and inspiration 

https://github.com/floooh/pacman.zig

https://github.com/Deecellar/bottom-zig