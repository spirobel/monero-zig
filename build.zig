const std = @import("std");

pub fn build(b: *std.build.Builder) void {
    // Standard release options allow the person running `zig build` to select
    // between Debug, ReleaseSafe, ReleaseFast, and ReleaseSmall.
    const mode = b.standardReleaseOptions();

    //https://zig.news/samhattangady/porting-my-game-to-the-web-4194
    const target = std.zig.CrossTarget.parse(.{ .arch_os_abi = "wasm32-freestanding" }) catch unreachable;
    const lib = b.addSharedLibrary("monero-zig", "src/main.zig", .unversioned);
    lib.addCSourceFile("src/minus.c", &[_][]const u8{
    "-Wall",
    "-Wextra",
    "-Werror",
});
    lib.setTarget(target);
    lib.setBuildMode(mode);
    lib.addSystemIncludeDir("src");
    lib.install();

    const main_tests = b.addTest("src/main.zig");
    main_tests.setBuildMode(mode);

    const test_step = b.step("test", "Run library tests");
    test_step.dependOn(&main_tests.step);
}
