const std = @import("std");
const fs = std.fs;

pub fn build(b: *std.build.Builder) !void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    const target = std.zig.CrossTarget.parse(.{ .arch_os_abi = "wasm32-wasi" }) catch unreachable;

    const sysroot = try fs.path.join(b.allocator, &.{ b.build_root, "emsdk/upstream/emscripten/cache/sysroot" });
    defer b.allocator.free(sysroot);

    // derive the emcc and emrun paths from the provided sysroot:
    const emcc_path = try fs.path.join(b.allocator, &.{ sysroot, "../../emcc" });
    defer b.allocator.free(emcc_path);
    const emrun_path = try fs.path.join(b.allocator, &.{ sysroot, "../../emrun" });
    defer b.allocator.free(emrun_path);

    // for some reason, the sysroot/include path must be provided separately
    const include_path = try fs.path.join(b.allocator, &.{ sysroot, "include"});
    defer b.allocator.free(include_path);
    
    //1.build the zig code
    const libbase58 = b.addStaticLibrary("base58", "external/monero/src/common/base58.cpp");
    libbase58.addSystemIncludeDir("external/monero/src/");
    libbase58.addSystemIncludeDir("external/libsodium/src/libsodium/include/");
    libbase58.addSystemIncludeDir("external/monero/contrib/epee/include");
    libbase58.addSystemIncludeDir("external/boost/utility/include/");
    libbase58.addSystemIncludeDir("external/boost/config/include/");
    libbase58.addSystemIncludeDir("external/boost/io/include/");
    libbase58.addSystemIncludeDir("external/boost/throw_exception/include/");
    libbase58.addSystemIncludeDir("external/boost/assert/include/");
    libbase58.addSystemIncludeDir("external/boost/optional/include/");
    libbase58.addSystemIncludeDir("external/boost/core/include/");
    libbase58.addSystemIncludeDir("external/boost/static_assert/include/");
    libbase58.addSystemIncludeDir("external/boost/type_traits/include/");
    libbase58.addSystemIncludeDir("external/boost/move/include/");


    libbase58.linkLibCpp();
    libbase58.setTarget(target);
    libbase58.setBuildMode(mode);
    libbase58.install();


    const libmonerozig = b.addStaticLibrary("monero-zig", "src/main.zig");
    libmonerozig.addSystemIncludeDir("src");
    libmonerozig.addSystemIncludeDir(include_path);
    libmonerozig.setTarget(target);
    libmonerozig.setBuildMode(mode);
    libmonerozig.install();
    //2.build the cpp wrapper
    const cpp_wrapper = b.addSystemCommand(&.{
        emcc_path,
        "src/moneroWrapper.cpp",
        "-c",
        "-ozig-out/lib/libmoneroWrapper.a",
        "-stdlib=libc++"
    });
    //3.link everything together
    const link_everything_together = b.addSystemCommand(&.{
        emcc_path,
        "-ozig-out/xmr3.wasm",
        "-Lzig-out/lib/",
        "-lmonero-zig",
        "-lmoneroWrapper",
        "--no-entry",
         "-sMALLOC='emmalloc'",
                  "-sEXPORTED_FUNCTIONS=_monero_base58_encode",
                  "-sLLD_REPORT_UNDEFINED"
      //   "-sMAIN_MODULE=1",

    });
    link_everything_together.step.dependOn(&libmonerozig.install_step.?.step);
    link_everything_together.step.dependOn(&cpp_wrapper.step);
    
    // get the emcc step to run on 'zig build'
    b.getInstallStep().dependOn(&link_everything_together.step);


}
