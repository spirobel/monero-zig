const std = @import("std");
const c = @cImport({
    @cInclude("moneroWrapper.h");
});

pub fn main() !void {
    const bla = c.monero_base58_encode_wrapper();
    const stdout = std.io.getStdOut().writer();
        try stdout.print("Hello, {s}!\n", .{"world"});

std.debug.print("c : {}: \n", .{ bla });
}
    //std.log.info("{}",.{c.minus_c()}) ;
export fn monero_base58_encode() void {
   // const bla = c.monero_base58_encode_wrapper();
//std.debug.print("c : {}: \n", .{ bla });
}