#pragma once
#include <cstdint>

using U64 = unsigned long long int;

enum class Color : uint8_t { White, Black };

inline Color opponent(Color c) noexcept {
    return c == Color::White ? Color::Black : Color::White;
}

enum class PieceType : uint8_t {
    Pawn, Knight, Bishop, Rook, Queen, King,
    COUNT // = 6
};

struct Piece {
    Color     color;
    PieceType type;

    constexpr int index() const noexcept {
        return static_cast<int>(type)
            + (color == Color::Black ? 6 : 0);
    }

    static constexpr Piece from_index(int i) noexcept {
        return { i < 6 ? Color::White : Color::Black,
                 static_cast<PieceType>(i % 6) };
    }

    constexpr bool operator==(const Piece&) const = default;
};

inline constexpr int PIECE_COUNT = 12;

// Centipawn score sentinel values
inline constexpr int INF = 1'000'000;
inline constexpr int NEG_INF = -1'000'000;
inline constexpr int CHECKMATE = 900'000;
