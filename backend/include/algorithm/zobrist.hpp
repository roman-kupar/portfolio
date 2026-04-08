#pragma once
#include "../engine_core/types.hpp"
#include "../engine_core/bit_board.hpp"
#include <array>
#include <cstdint>
#include <random>

// Forward declaration to avoid circular dependencies
struct Position;

namespace Zobrist {

    namespace detail {

        // Piece index: 6 types * 2 colors = 12 slots.
        // Uses a constexpr lookup table instead of a switch — one load, no
        // Requires PieceType values to be contiguous starting at 0:
        //   Pawn=0, Knight=1, Bishop=2, Rook=3, Queen=4, King=5, COUNT=6
        constexpr int piece_index(Color c, PieceType t) noexcept {
            constexpr std::array<int, 7> type_to_idx = { 0, 1, 2, 3, 4, 5, 0 };
            return type_to_idx[static_cast<int>(t)] + (c == Color::Black ? 6 : 0);
        }

        struct Tables {
            // [piece_index][square]
            std::array<std::array<uint64_t, 64>, 12> piece{};
            // en-passant file 0–7
            std::array<uint64_t, 8>  en_passant{};
            // castling rights: bit 0 = white kingside,  1 = white queenside,
            //                  bit 2 = black kingside,  3 = black queenside
            std::array<uint64_t, 16> castling{};
            uint64_t                 black_to_move = 0;

            Tables() noexcept {
                // Deterministic seed - hashes are reproducible across runs
                std::mt19937_64 rng(0xDEAD'BEEF'CAFE'1234ULL);
                for (auto& p : piece)    for (auto& v : p) v = rng();
                for (auto& v : en_passant)                  v = rng();
                for (auto& v : castling)                    v = rng();
                black_to_move = rng();
            }
        };

        inline const Tables& tables() noexcept {
            static Tables t;
            return t;
        }

    } // namespace detail

    // Implemented in Position.hpp to avoid circular include issues
    uint64_t hash(const Position& pos) noexcept;

} // namespace Zobrist