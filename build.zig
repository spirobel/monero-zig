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
    const libmonerozig = b.addStaticLibrary("monero-zig", "src/main.zig");
    libmonerozig.addSystemIncludeDir("src");
    libmonerozig.setTarget(target);
    libmonerozig.setBuildMode(mode);
    libmonerozig.install();

    //2.build the cpp wrapper
    const cpp_wrapper = b.addSystemCommand(&.{
        emcc_path,
        "src/moneroWrapper.cpp",
        "-c",
        "-ozig-out/lib/libmoneroWrapper.a",
    });
    //3.link everything together
    const link_everything_together = b.addSystemCommand(&.{
        emcc_path,
        "-ozig-out/xmr3.wasm",
        "-Lzig-out/lib/",
        "-lmonero-zig",
        "-lmoneroWrapper",
        "--no-entry",
        "-sEXPORTED_FUNCTIONS=monero_base58_encode"


    });
    link_everything_together.step.dependOn(&libmonerozig.install_step.?.step);
    link_everything_together.step.dependOn(&cpp_wrapper.step);
    
    // get the emcc step to run on 'zig build'
    b.getInstallStep().dependOn(&link_everything_together.step);


}
