#pragma once
#include "Position.hpp"
#include <vector>

// MoveGenerator 
// Generates pseudo-legal moves per piece, then filters to fully legal moves
// by verifying the king is not left in check after each move.

class MoveGenerator {
public:
    explicit MoveGenerator(Position pos) : pos_(pos) {}

    void pawn_moves(uint8_t sq, std::vector<Move>& out) const;
    void rook_moves(uint8_t sq, std::vector<Move>& out) const;
    void bishop_moves(uint8_t sq, std::vector<Move>& out) const;
    void knight_moves(uint8_t sq, std::vector<Move>& out) const;
    void queen_moves(uint8_t sq, std::vector<Move>& out) const;
    void king_moves(uint8_t sq, std::vector<Move>& out) const;

    std::vector<Move> pseudo_legal_moves() const;

    std::vector<Move> legal_moves() const;

    bool is_in_check(Color color) const;

    bool is_square_attacked(uint8_t sq, Color attacker) const;

private:
    Position pos_;

    void push(uint8_t from, uint8_t to, Piece piece,
        std::vector<Move>& out, MoveFlag flag = MoveFlag::None, std::optional<Piece> captured = std::nullopt) const {
        if (!captured) captured = pos_.pieces.get(to);
        out.push_back({ from, to, piece, flag, captured });
    }

    void slide(uint8_t sq, Piece piece,
        int dx, int dy, std::vector<Move>& out) const {
        int x = sq_x(sq), y = sq_y(sq);
        while (true) {
            x += dx;  y += dy;
            if (x < 0 || x > 7 || y < 0 || y > 7) break;

            uint8_t target = to_square(x, y);
            auto    occupant = pos_.pieces.get(target);

            if (occupant) {
                if (occupant->color != piece.color)   // enemy: capture and stop
                    push(sq, target, piece, out);
                break;                                // friendly: just stop
            }
            push(sq, target, piece, out);             // empty square: quiet move
        }
    }
};

inline bool MoveGenerator::is_square_attacked(uint8_t sq, Color attacker) const {
    // Generate opponent moves and see if they attack sq.
    Position opp_pos = pos_;
    opp_pos.side_to_move = attacker;
    MoveGenerator opp(opp_pos);
    for (const Move& m : opp.pseudo_legal_moves()) {
        if (m.to == sq) return true;
    }
    return false;
}

inline void MoveGenerator::pawn_moves(uint8_t sq, std::vector<Move>& out) const {
    const int   x = sq_x(sq);
    const int   y = sq_y(sq);
    const Color us = pos_.side_to_move;
    const int   dir = (us == Color::White) ? +1 : -1;
    const int   start = (us == Color::White) ? 1 : 6;   // starting rank
    const int   promo = (us == Color::White) ? 7 : 0;
    const Piece pawn = { us, PieceType::Pawn };

    // Single push
    const int ny = y + dir;
    if (ny >= 0 && ny <= 7) {
        const uint8_t one_up = to_square(x, ny);
        if (!pos_.pieces.get(one_up)) {
            if (ny == promo) {
                push(sq, one_up, pawn, out, MoveFlag::PromoQueen);
                push(sq, one_up, pawn, out, MoveFlag::PromoRook);
                push(sq, one_up, pawn, out, MoveFlag::PromoBishop);
                push(sq, one_up, pawn, out, MoveFlag::PromoKnight);
            } else {
                push(sq, one_up, pawn, out);

                // Double push from starting rank
                if (y == start) {
                    const uint8_t two_up = to_square(x, y + 2 * dir);
                    if (!pos_.pieces.get(two_up)) {
                        push(sq, two_up, pawn, out, MoveFlag::DoublePush);
                    }
                }
            }
        }
    }

    // Diagonal captures 
    for (int dx : {-1, +1}) {
        const int cx = x + dx;
        const int cy = y + dir;
        if (cx < 0 || cx > 7 || cy < 0 || cy > 7) continue;

        const uint8_t cap_sq = to_square(cx, cy);
        const auto    occupant = pos_.pieces.get(cap_sq);

        if (occupant && occupant->color != us) {
            if (cy == promo) {
                push(sq, cap_sq, pawn, out, MoveFlag::PromoQueen);
                push(sq, cap_sq, pawn, out, MoveFlag::PromoRook);
                push(sq, cap_sq, pawn, out, MoveFlag::PromoBishop);
                push(sq, cap_sq, pawn, out, MoveFlag::PromoKnight);
            } else {
                push(sq, cap_sq, pawn, out);
            }
        }

        // En passant
        if (!occupant && cx == pos_.en_passant && cy == (us == Color::White ? 5 : 2) && y == (us == Color::White ? 4 : 3)) {
            push(sq, cap_sq, pawn, out, MoveFlag::EnPassant, Piece{opponent(us), PieceType::Pawn});
        }
    }
}

inline void MoveGenerator::knight_moves(uint8_t sq, std::vector<Move>& out) const {
    const int   x = sq_x(sq);
    const int   y = sq_y(sq);
    const Piece knight = { pos_.side_to_move, PieceType::Knight };

    constexpr int offsets[8][2] = {
        {-2,-1},{-2,+1},{+2,-1},{+2,+1},
        {-1,-2},{-1,+2},{+1,-2},{+1,+2}
    };

    for (auto& [dx, dy] : offsets) {
        const int nx = x + dx, ny = y + dy;
        if (nx < 0 || nx > 7 || ny < 0 || ny > 7) continue;

        const uint8_t target = to_square(nx, ny);
        const auto    occupant = pos_.pieces.get(target);

        if (!occupant || occupant->color != pos_.side_to_move)
            push(sq, target, knight, out);
    }
}

inline void MoveGenerator::bishop_moves(uint8_t sq, std::vector<Move>& out) const {
    const Piece bishop = { pos_.side_to_move, PieceType::Bishop };
    for (auto [dx, dy] : std::initializer_list<std::pair<int, int>>{
            {-1,-1},{-1,+1},{+1,-1},{+1,+1} })
            slide(sq, bishop, dx, dy, out);
}

inline void MoveGenerator::rook_moves(uint8_t sq, std::vector<Move>& out) const {
    const Piece rook = { pos_.side_to_move, PieceType::Rook };
    for (auto [dx, dy] : std::initializer_list<std::pair<int, int>>{
            {-1,0},{+1,0},{0,-1},{0,+1} })
            slide(sq, rook, dx, dy, out);
}

inline void MoveGenerator::queen_moves(uint8_t sq, std::vector<Move>& out) const {
    const Piece queen = { pos_.side_to_move, PieceType::Queen };
    for (auto [dx, dy] : std::initializer_list<std::pair<int, int>>{
            {-1,-1},{-1,+1},{+1,-1},{+1,+1},
            {-1, 0},{+1, 0},{ 0,-1},{ 0,+1} })
            slide(sq, queen, dx, dy, out);
}

inline void MoveGenerator::king_moves(uint8_t sq, std::vector<Move>& out) const {
    const int   x = sq_x(sq);
    const int   y = sq_y(sq);
    const Piece king = { pos_.side_to_move, PieceType::King };

    for (int dx = -1; dx <= 1; ++dx) {
        for (int dy = -1; dy <= 1; ++dy) {
            if (dx == 0 && dy == 0) continue;
            const int nx = x + dx, ny = y + dy;
            if (nx < 0 || nx > 7 || ny < 0 || ny > 7) continue;

            const uint8_t target = to_square(nx, ny);
            const auto    occupant = pos_.pieces.get(target);

            if (!occupant || occupant->color != pos_.side_to_move)
                push(sq, target, king, out);
        }
    }

    // Castling
    auto rights = pos_.castling_for(pos_.side_to_move);
    if (rights.any()) {
        Color opp = opponent(pos_.side_to_move);
        int rank = (pos_.side_to_move == Color::White) ? 0 : 7;

        if (sq == to_square(4, rank)) {
            // Kingside
            if (rights.kingside) {
                if (!pos_.pieces.get(to_square(5, rank)) && !pos_.pieces.get(to_square(6, rank))) {
                    if (!is_square_attacked(to_square(4, rank), opp) &&
                        !is_square_attacked(to_square(5, rank), opp) &&
                        !is_square_attacked(to_square(6, rank), opp)) {
                        push(sq, to_square(6, rank), king, out, MoveFlag::CastleKing);
                    }
                }
            }
            // Queenside
            if (rights.queenside) {
                if (!pos_.pieces.get(to_square(3, rank)) && !pos_.pieces.get(to_square(2, rank)) && !pos_.pieces.get(to_square(1, rank))) {
                    if (!is_square_attacked(to_square(4, rank), opp) &&
                        !is_square_attacked(to_square(3, rank), opp) &&
                        !is_square_attacked(to_square(2, rank), opp)) {
                        push(sq, to_square(2, rank), king, out, MoveFlag::CastleQueen);
                    }
                }
            }
        }
    }
}

inline bool MoveGenerator::is_in_check(Color color) const {
    const U64 board = pos_.pieces.board_for({ color, PieceType::King });
    if (board == 0) return false;   // no king - shouldn't happen in a real game :)
    const uint8_t king_sq = static_cast<uint8_t>(std::countr_zero(board));
    return is_square_attacked(king_sq, opponent(color));
}

inline std::vector<Move> MoveGenerator::pseudo_legal_moves() const {
    std::vector<Move> moves;
    moves.reserve(48);   // minimum chess branching factor

    const Color us = pos_.side_to_move;

    for (int sq = 0; sq < 64; ++sq) {
        const auto piece = pos_.pieces.get(static_cast<uint8_t>(sq));
        if (!piece || piece->color != us) continue;

        switch (piece->type) {
        case PieceType::Pawn:   pawn_moves(sq, moves); break;
        case PieceType::Knight: knight_moves(sq, moves); break;
        case PieceType::Bishop: bishop_moves(sq, moves); break;
        case PieceType::Rook:   rook_moves(sq, moves); break;
        case PieceType::Queen:  queen_moves(sq, moves); break;
        case PieceType::King:   king_moves(sq, moves); break;
        default: break;
        }
    }

    return moves;
}

inline std::vector<Move> MoveGenerator::legal_moves() const {
    const auto pseudo = pseudo_legal_moves();
    std::vector<Move> legal;
    legal.reserve(pseudo.size());

    for (const Move& m : pseudo) {
        const Position next = pos_.apply(m);
        MoveGenerator after(next);
        if (!after.is_in_check(pos_.side_to_move)) { 
             legal.push_back(m);
        }
    }

    return legal;
}