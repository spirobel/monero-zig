const std = @import("std");
const c = @cImport({
    @cInclude("moneroWrapper.h");
});

pub fn main() !void {
    var general_purpose_allocator = std.heap.GeneralPurposeAllocator(.{}){};
    const gpa = general_purpose_allocator.allocator();
    const args = try std.process.argsAlloc(gpa);
    defer std.process.argsFree(gpa, args);

    for (args) |arg, i| {
        std.debug.print("{}: {s}\n", .{ i, arg });
    }
    const bla = c.monero_base58_encode_wrapper();
    std.debug.print("c : {}: \n", .{ bla });

}
    //std.log.info("{}",.{c.minus_c()}) ;
export fn monero_base58_encode() void {
    const bla = c.monero_base58_encode_wrapper();
    std.debug.print("c : {}: \n", .{ bla });
}