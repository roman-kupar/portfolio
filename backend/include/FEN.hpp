#pragma once
#include "Position.hpp"
#include <string>
#include <stdexcept>
#include <cctype>

// Parses FEN strings into a Position.

namespace fen {

    namespace detail {

        inline Piece char_to_piece(char c) {
            switch (c) {
            case 'P': return { Color::White, PieceType::Pawn };
            case 'N': return { Color::White, PieceType::Knight };
            case 'B': return { Color::White, PieceType::Bishop };
            case 'R': return { Color::White, PieceType::Rook };
            case 'Q': return { Color::White, PieceType::Queen };
            case 'K': return { Color::White, PieceType::King };
            case 'p': return { Color::Black, PieceType::Pawn };
            case 'n': return { Color::Black, PieceType::Knight };
            case 'b': return { Color::Black, PieceType::Bishop };
            case 'r': return { Color::Black, PieceType::Rook };
            case 'q': return { Color::Black, PieceType::Queen };
            case 'k': return { Color::Black, PieceType::King };
            default:  throw std::invalid_argument(std::string("Unknown FEN piece char: ") + c);
            }
        }

    } // namespace detail

    inline Position parse(const std::string& fen) {
        Position pos;
        pos.side_to_move = Color::White;
        pos.halfmove_clock = 0;
        pos.white_castle = {false, false};
        pos.black_castle = {false, false};
        pos.en_passant = 255;

        auto it = fen.cbegin();

        // Field 1: piece placement
        int x = 0, y = 7;
        for (; it != fen.cend() && *it != ' '; ++it) {
            const char c = *it;
            if (c == '/') {
                y--;
                x = 0;
            }
            else if (std::isdigit(c)) {
                x += (c - '0');
            }
            else {
                pos.pieces.set(to_square(x, y), detail::char_to_piece(c));
                x++;
            }
        }

        auto skip_spaces = [&]() {
            while (it != fen.cend() && *it == ' ') ++it;
        };

        skip_spaces();
        if (it == fen.cend()) return pos;

        // Field 2: side to move 
        if (it != fen.cend()) {
            pos.side_to_move = (*it == 'b') ? Color::Black : Color::White;
            ++it;
        }

        skip_spaces();
        if (it == fen.cend()) return pos;

        // Field 3: castling availability
        if (*it == '-') {
            ++it;
        } else {
            while (it != fen.cend() && *it != ' ') {
                if (*it == 'K') pos.white_castle.kingside = true;
                if (*it == 'Q') pos.white_castle.queenside = true;
                if (*it == 'k') pos.black_castle.kingside = true;
                if (*it == 'q') pos.black_castle.queenside = true;
                ++it;
            }
        }

        skip_spaces();
        if (it == fen.cend()) return pos;

        //  Field 4: en passant square
        if (*it == '-') {
            ++it;
        } else {
            if (it != fen.cend()) {
                char file = *it; ++it;
                pos.en_passant = file - 'a';
                if (it != fen.cend() && *it != ' ') ++it; // skip rank
            }
        }

        skip_spaces();
        if (it == fen.cend()) return pos;

        //  Field 5: halfmove clock 
        if (it != fen.cend() && std::isdigit(*it)) {
            pos.halfmove_clock = 0;
            while (it != fen.cend() && std::isdigit(*it)) {
                pos.halfmove_clock = pos.halfmove_clock * 10 + (*it - '0');
                ++it;
            }
        }

        return pos;
    }

} // namespace fen