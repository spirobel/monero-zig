const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    //https://zig.news/samhattangady/porting-my-game-to-the-web-4194
    const target = std.zig.CrossTarget.parse(.{ .arch_os_abi = "wasm32-wasi" }) catch unreachable;
    const lib = b.addExecutable("monero-zig", "src/main.zig");
     lib.addCSourceFile("src/minus.cpp", &[_][]const u8{
     "-Wall",
     "-Wextra",
     "-Werror",
 }); 
    lib.linkLibCpp();
    lib.setTarget(target);
    lib.setBuildMode(mode);
    lib.addSystemIncludeDir("src");
    lib.install();

}
