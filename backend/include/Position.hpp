#pragma once
#include "engine_core/types.hpp"
#include "engine_core/move.hpp"
#include "engine_core/bit_board.hpp"
#include "algorithm/zobrist.hpp"

struct Position {
    BitBoard       pieces;
    Color          side_to_move = Color::White;
    uint8_t        en_passant = 255;
    CastlingRights white_castle;
    CastlingRights black_castle;
    uint8_t        halfmove_clock = 0;
    uint64_t       hash = 0;              

    static inline Position starting() {
        Position p;
        p.hash = Zobrist::hash(p);        
        return p;
    }

    [[nodiscard]] Position apply(const Move& m) const {
        Position next = *this;

        const auto& t = Zobrist::detail::tables();

        // Piece leaving its square 
        next.hash ^= t.piece[Zobrist::detail::piece_index(m.piece.color, m.piece.type)][m.from];

        // Capture 
        if (m.captured) {
            if (m.flag == MoveFlag::EnPassant) {
                uint8_t ep_sq = to_square(sq_x(m.to), sq_y(m.from));
                next.hash ^= t.piece[Zobrist::detail::piece_index(m.captured->color, m.captured->type)][ep_sq];
                next.pieces.clear(ep_sq, *m.captured);
            }
            else {
                next.hash ^= t.piece[Zobrist::detail::piece_index(m.captured->color, m.captured->type)][m.to];
                next.pieces.clear(m.to, *m.captured);
            }
        }

        if (m.is_promotion()) {
            Piece promoted = { m.piece.color, *m.promo_type() };
            next.hash ^= t.piece[Zobrist::detail::piece_index(promoted.color, promoted.type)][m.to];
            next.pieces.set(m.to, promoted);
        }
        else {
            next.hash ^= t.piece[Zobrist::detail::piece_index(m.piece.color, m.piece.type)][m.to];
            next.pieces.set(m.to, m.piece);
        }
        next.pieces.clear(m.from, m.piece);

        if (m.flag == MoveFlag::CastleKing || m.flag == MoveFlag::CastleQueen) {
            uint8_t rook_from = to_square(m.flag == MoveFlag::CastleKing ? 7 : 0, sq_y(m.to));
            uint8_t rook_to = to_square(m.flag == MoveFlag::CastleKing ? 5 : 3, sq_y(m.to));
            Piece rook = { m.piece.color, PieceType::Rook };
            int ri = Zobrist::detail::piece_index(rook.color, rook.type);
            next.hash ^= t.piece[ri][rook_from];  // rook leaves
            next.hash ^= t.piece[ri][rook_to];    // rook arrives
            next.pieces.clear(rook_from, rook);
            next.pieces.set(rook_to, rook);
        }

        auto castle_key = [&](const Position& p) -> uint8_t {
            return (p.white_castle.kingside ? 0b0001 : 0)
                | (p.white_castle.queenside ? 0b0010 : 0)
                | (p.black_castle.kingside ? 0b0100 : 0)
                | (p.black_castle.queenside ? 0b1000 : 0);
            };

        next.hash ^= t.castling[castle_key(next)];   // remove old castling hash
        if (en_passant != 255) next.hash ^= t.en_passant[en_passant]; // remove old ep


        if (m.flag == MoveFlag::DoublePush) {
            next.en_passant = sq_x(m.to);
            next.hash ^= t.en_passant[next.en_passant]; // add new ep
        }
        else {
            next.en_passant = 255;
        }

        next.hash ^= t.castling[castle_key(next)];    // add new castling hash

        next.side_to_move = opponent(side_to_move);
        next.hash ^= t.black_to_move;                 // flip every move


        return next;
    }

 
    bool is_fifty_move_draw() const noexcept { return halfmove_clock >= 100; }

    CastlingRights castling_for(Color c) const noexcept {
        return c == Color::White ? white_castle : black_castle;
    }
};

inline uint64_t Zobrist::hash(const Position& pos) noexcept {
    const auto& t = detail::tables();
    uint64_t h = 0;

    for (int sq = 0; sq < 64; ++sq) {
        if (auto piece = pos.pieces.get(sq)) {
            h ^= t.piece[detail::piece_index(piece->color, piece->type)][sq];
        }
    }

    // Side to move
    if (pos.side_to_move == Color::Black)
        h ^= t.black_to_move;

    // En passant
    if (pos.en_passant != 255)
        h ^= t.en_passant[pos.en_passant];

    // Castling rights
    const uint8_t castle_key =
        (pos.white_castle.kingside ? 0b0001 : 0) |
        (pos.white_castle.queenside ? 0b0010 : 0) |
        (pos.black_castle.kingside ? 0b0100 : 0) |
        (pos.black_castle.queenside ? 0b1000 : 0);
    h ^= t.castling[castle_key];

    return h;
}
