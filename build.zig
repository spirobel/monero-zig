const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    //https://zig.news/samhattangady/porting-my-game-to-the-web-4194
    const target = std.zig.CrossTarget.parse(.{ .arch_os_abi = "wasm32-wasi" }) catch unreachable;
    const exe = b.addExecutable("monero-zig", "src/main.zig");
    const lib = b.addSharedLibrary("minus", null,.unversioned);
        lib.addSystemIncludeDir("/home/test/Projects/zig/monero-zig/wasi-sdk-14.0/share/wasi-sysroot");
        lib.addSystemIncludeDir("src");
     lib.addCSourceFile("src/minus.cpp", &[_][]const u8{
     "-Wall",
     "-Wextra",
     "-Werror",
 }); 
    lib.linkLibCpp();
    lib.setTarget(target);
    lib.setBuildMode(mode);
    lib.install();
     exe.linkLibrary(lib);

}
