const fs = require('fs');
const source = fs.readFileSync("zig-out/bin/monero-zig.wasm");
const typedArray = new Uint8Array(source);

WebAssembly.instantiate(typedArray, {
  wasi_snapshot_preview1: {
    args_get: function(){console.log("args_get lol")}, // ((param i32 i32) (result i32))
    args_sizes_get: function(){console.log("args_sizes_get lol")}, // ((param i32 i32) (result i32))

    clock_res_get: this.clock_res_get, // ((param i32 i32) (result i32))
    clock_time_get: this.clock_time_get, // ((param i32 i64 i32) (result i32))

    environ_get: function(){console.log("environ_get lol")}, // ((param i32 i32) (result i32))
    environ_sizes_get: function(){console.log("environ_sizes_get lol")}, // ((param i32 i32) (result i32))

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
    fd_prestat_dir_name: function(){console.log("fd_prestat_dir_name lol")}, // ((param i32 i32 i32) (result i32))
    fd_prestat_get: function(){console.log("fd_prestat_get lol")}, // ((param i32 i32) (result i32))
    fd_pwrite: undefined, // ((param i32 i32 i32 i64 i32) (result i32))
    fd_read: function(){console.log("fd_read lol")}, // ((param i32 i32 i32 i32) (result i32))
    fd_readdir: undefined, // ((param i32 i32 i32 i64 i32) (result i32))
    fd_renumber: undefined, // ((param i32 i32) (result i32))
    fd_seek:  function(){console.log("fd_seek lol")}, // ((param i32 i64 i32 i32) (result i32))
    fd_sync: undefined, // ((param i32) (result i32))
    fd_tell: undefined, // ((param i32 i32) (result i32))
    fd_write: function(){console.log("fd_write lol")}, // ((param i32 i32 i32 i32) (result i32))

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
  const monero_base58_encode = result.instance.exports.monero_base58_encode;
  console.log(monero_base58_encode());
});
