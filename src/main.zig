const std = @import("std");
const c = @cImport({
    @cInclude("minus.h");
});
const testing = std.testing;
extern fn print(i32) void;

export fn add(a: i32, b: i32) i32 {
    return a + b;
}

export fn minus(a: i32, b: i32 ) i32 {
    return c.minus_c(a, b);
}


test "basic add functionality" {
    try testing.expect(add(3, 7) == 10);
}
