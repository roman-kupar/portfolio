#pragma once
#include "../../Position.hpp"
#include "../../engine_core/constants.hpp"
#include <bit> 

struct MaterialTerm {
    static constexpr const char* name() { return "material"; }

    int score(const Position& pos, Color us) const noexcept {
        const int base = (us == Color::Black) ? 6 : 0;
        int total = 0;
        for (int i = 0; i < 6; ++i)
            total += std::popcount(pos.pieces.raw()[base + i])
            * piece_value(static_cast<PieceType>(i));
        return total;
    }

private:
    static int piece_value(PieceType t) noexcept {
        using namespace chess::piece_value;
        switch (t) {
        case PieceType::Pawn:   return PAWN;
        case PieceType::Knight: return KNIGHT;
        case PieceType::Bishop: return BISHOP;
        case PieceType::Rook:   return ROOK;
        case PieceType::Queen:  return QUEEN;
        case PieceType::King:   return KING;
        default:                return 0;
        }
    }
};