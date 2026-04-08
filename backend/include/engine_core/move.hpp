#pragma once
#include "types.hpp"
#include <optional>

enum class MoveFlag : uint8_t {
    None = 0,
    DoublePush = 1,
    EnPassant = 2,   
    CastleKing = 3,   
    CastleQueen = 4,  
    PromoKnight = 5,
    PromoBishop = 6,
    PromoRook = 7,
    PromoQueen = 8,
};

struct Move {
    uint8_t  from;           // square index 0-63
    uint8_t  to;             // square index 0-63
    Piece    piece;          // piece being moved

    MoveFlag flag = MoveFlag::None;

    // Captured piece, if any (nullopt = quiet move)
    std::optional<Piece> captured = std::nullopt;

    bool is_promotion() const noexcept {
        return flag >= MoveFlag::PromoKnight;
    }

    std::optional<PieceType> promo_type() const noexcept {
        switch (flag) {
        case MoveFlag::PromoKnight: return PieceType::Knight;
        case MoveFlag::PromoBishop: return PieceType::Bishop;
        case MoveFlag::PromoRook:   return PieceType::Rook;
        case MoveFlag::PromoQueen:  return PieceType::Queen;
        default:                    return std::nullopt;
        }
    }

    // Null move sentinel 
    static Move null() noexcept {
        return { 0, 0, Piece{Color::White, PieceType::Pawn} };
    }

    bool operator==(const Move&) const = default;
};

// Helpers for converting between (x,y) coords and square index
inline constexpr uint8_t to_square(int x, int y)  noexcept { return y * 8 + x; }
inline constexpr int     sq_x(uint8_t sq)         noexcept { return sq % 8; }
inline constexpr int     sq_y(uint8_t sq)         noexcept { return sq / 8; }