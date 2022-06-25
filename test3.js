const fs = require('fs');
const source = fs.readFileSync("zig-out/bin/monero-zig.wasm");
const typedArray = new Uint8Array(source);
var WASI_ESUCCESS = 0;
var WASI_EBADF = 8;
var WASI_EINVAL = 28;
var WASI_ENOSYS = 52;

var WASI_STDOUT_FILENO = 1;
var mem = null;

function getModuleMemoryDataView() {
  // call this any time you'll be reading or writing to a module's memory 
  // the returned DataView tends to be dissaociated with the module's memory buffer at the will of the WebAssembly engine 
  // cache the returned DataView at your own peril!!

  return new DataView(mem.buffer);
}

function fd_prestat_get(fd, bufPtr) {

  return WASI_EBADF;
}

function fd_prestat_dir_name(fd, pathPtr, pathLen) {

   return WASI_EINVAL;
}

function environ_sizes_get(environCount, environBufSize) {

  var view = getModuleMemoryDataView();

  view.setUint32(environCount, 0, !0);
  view.setUint32(environBufSize, 0, !0);

  return WASI_ESUCCESS;
}

function fd_write(fd, iovs, iovsLen, nwritten) {

  var view = getModuleMemoryDataView();

  var written = 0;
  var bufferBytes = [];                   

  function getiovs(iovs, iovsLen) {
      // iovs* -> [iov, iov, ...]
      // __wasi_ciovec_t {
      //   void* buf,
      //   size_t buf_len,
      // }
      var buffers = Array.from({ length: iovsLen }, function (_, i) {
             var ptr = iovs + i * 8;
             var buf = view.getUint32(ptr, !0);
             var bufLen = view.getUint32(ptr + 4, !0);

             return new Uint8Array(mem, buf, bufLen);
          });

      return buffers;
  }

  var buffers = getiovs(iovs, iovsLen);
  function writev(iov) {

      for (var b = 0; b < iov.byteLength; b++) {

         bufferBytes.push(iov[b]);
      }

      written += b;
  }

  buffers.forEach(writev);

  if (fd === WASI_STDOUT_FILENO) console.log(String.fromCharCode.apply(null, bufferBytes));                            

  view.setUint32(nwritten, written, !0);

  return WASI_ESUCCESS;
}


WebAssembly.instantiate(typedArray, {
  wasi_snapshot_preview1: {
    args_get: function(){console.log("args_get lol")}, // ((param i32 i32) (result i32))
    args_sizes_get: function(){console.log("args_sizes_get lol")}, // ((param i32 i32) (result i32))

    clock_res_get: this.clock_res_get, // ((param i32 i32) (result i32))
    clock_time_get: this.clock_time_get, // ((param i32 i64 i32) (result i32))

    environ_get: function(){console.log("environ_get lol")}, // ((param i32 i32) (result i32))
    environ_sizes_get: environ_sizes_get, // ((param i32 i32) (result i32))

    fd_advise: undefined, // ((param i32 i64 i64 i32) (result i32))
    fd_allocate: undefined, // ((param i32 i64 i64) (result i32))
    fd_close: function(){console.log("fd_close lol")}, // ((param i32) (result i32))
    fd_datasync: undefined, // ((param i32) (result i32))
    fd_fdstat_get: function(){console.log("fd_fdstat_get lol")}, // ((param i32 i32) (result i32))
    fd_fdstat_set_flags: undefined, // ((param i32 i32) (result i32))
    fd_fdstat_set_rights: undefined, // ((param i32 i64 i64) (result i32))
    fd_filestat_get: undefined, // ((param i32 i32) (result i32))
    fd_filestat_set_size: undefined, // ((param i32 i64) (result i32))
    fd_filestat_set_times: undefined, // ((param i32 i64 i64 i32) (result i32))
    fd_pread: undefined, // ((param i32 i32 i32 i64 i32) (result i32))
    fd_prestat_dir_name: fd_prestat_dir_name, // ((param i32 i32 i32) (result i32))
    fd_prestat_get: fd_prestat_get, // ((param i32 i32) (result i32))
    fd_pwrite: undefined, // ((param i32 i32 i32 i64 i32) (result i32))
    fd_read: function(){console.log("fd_read lol")}, // ((param i32 i32 i32 i32) (result i32))
    fd_readdir: undefined, // ((param i32 i32 i32 i64 i32) (result i32))
    fd_renumber: undefined, // ((param i32 i32) (result i32))
    fd_seek:  function(){console.log("fd_seek lol")}, // ((param i32 i64 i32 i32) (result i32))
    fd_sync: undefined, // ((param i32) (result i32))
    fd_tell: undefined, // ((param i32 i32) (result i32))
    fd_write: fd_write, // ((param i32 i32 i32 i32) (result i32))

    path_create_directory: undefined, // ((param i32 i32 i32) (result i32))
    path_filestat_get: undefined, // ((param i32 i32 i32 i32 i32) (result i32))
    path_filestat_set_times: undefined, // ((param i32 i32 i32 i32 i64 i64 i32) (result i32))
    path_link: undefined, // ((param i32 i32 i32 i32 i32 i32 i32) (result i32))
    path_open: function(){console.log("path_open lol")}, // ((param i32 i32 i32 i32 i32 i64 i64 i32 i32) (result i32))
    path_readlink: undefined, // ((param i32 i32 i32 i32 i32 i32) (result i32))
    path_remove_directory: undefined, // ((param i32 i32 i32) (result i32))
    path_rename: undefined, // ((param i32 i32 i32 i32 i32 i32) (result i32))
    path_symlink: undefined, // ((param i32 i32 i32 i32 i32) (result i32))
    path_unlink_file: undefined, // ((param i32 i32 i32) (result i32))

    poll_oneoff: undefined, // ((param i32 i32 i32 i32) (result i32))

    proc_exit: function(){console.log("proc_exit lol")}, // ((param i32))
    proc_raise: undefined, // ((param i32) (result i32))

    random_get: this.random_get, // ((param i32 i32) (result i32))

    sched_yield: undefined, // ((result i32))

    sock_recv: undefined, // ((param i32 i32 i32 i32 i32 i32) (result i32))
    sock_send: undefined, // ((param i32 i32 i32 i32 i32) (result i32))
    sock_shutdown: undefined, // ((param i32 i32) (result i32))
},
  env: {
 

    

  }}).then(result => {
    console.log("exports",result.instance.exports)
    mem = result.instance.exports.memory;
  const monero_base58_encode = result.instance.exports.monero_base58_encode;
  const main = result.instance.exports.main;
 //   console.log(result.instance.exports._start())
 // console.log(main())
  console.log(monero_base58_encode());
});
