#pragma once 
#include "types.hpp"

namespace chess::files {
    inline constexpr U64 A = 0x8080808080808080ULL;
    inline constexpr U64 B = 0x4040404040404040ULL;
    inline constexpr U64 C = 0x2020202020202020ULL;
    inline constexpr U64 D = 0x1010101010101010ULL;
    inline constexpr U64 E = 0x0808080808080808ULL;
    inline constexpr U64 F = 0x0404040404040404ULL;
    inline constexpr U64 G = 0x0202020202020202ULL;
    inline constexpr U64 H = 0x0101010101010101ULL;
}

namespace chess::ranks {
    inline constexpr U64 R1 = 0x00000000000000FFULL;
    inline constexpr U64 R2 = 0x000000000000FF00ULL;
    inline constexpr U64 R6 = 0x0000FF0000000000ULL;
    inline constexpr U64 R7 = 0x00FF000000000000ULL;
    inline constexpr U64 R8 = 0xFF00000000000000ULL;
}

namespace chess::anti_diag {
    inline constexpr U64 A8 = 0x0000000000000080ULL;
    inline constexpr U64 A7B8 = 0x0000000000008040ULL;
    inline constexpr U64 A6C8 = 0x0000000000804020ULL;
    inline constexpr U64 A5D8 = 0x0000000080402010ULL;
    inline constexpr U64 A4E8 = 0x0000008040201008ULL;
    inline constexpr U64 A3F8 = 0x0000804020100804ULL;
    inline constexpr U64 A2G8 = 0x0080402010080402ULL;
    inline constexpr U64 A1H8 = 0x8040201008040201ULL;
}

namespace chess::main_diag {
    inline constexpr U64 A1 = 0x8000000000000000ULL;
    inline constexpr U64 A2B1 = 0x4080000000000000ULL;
    inline constexpr U64 A3C1 = 0x2040800000000000ULL;
    inline constexpr U64 A4D1 = 0x1020408000000000ULL;
    inline constexpr U64 A5E1 = 0x0810204080000000ULL;
    inline constexpr U64 A6F1 = 0x0408102040800000ULL;
    inline constexpr U64 A7G1 = 0x0204081020408000ULL;
    inline constexpr U64 A8H1 = 0x0102040810204080ULL;
}

// Piece values in centipawns
namespace chess::piece_value {
    inline constexpr int PAWN = 100;
    inline constexpr int KNIGHT = 320;
    inline constexpr int BISHOP = 330;
    inline constexpr int ROOK = 500;
    inline constexpr int QUEEN = 900;
    inline constexpr int KING = 20000;
}