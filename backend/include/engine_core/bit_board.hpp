#pragma once
#include "types.hpp"
#include "move.hpp"
#include <array>

class BitBoard {
public:
    static constexpr bool in_bounds(int x, int y) noexcept {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }
    static constexpr U64 mask(uint8_t sq) noexcept { return 1ULL << sq; }
    static constexpr U64 mask(int x, int y) noexcept { return mask(to_square(x, y)); }

    void set(uint8_t sq, Piece p)   noexcept { boards_[p.index()] |= mask(sq); }
    void clear(uint8_t sq, Piece p) noexcept { boards_[p.index()] &= ~mask(sq); }

    std::optional<Piece> get(uint8_t sq) const noexcept {
        const U64 m = mask(sq);
        for (int i = 0; i < PIECE_COUNT; ++i)
            if (boards_[i] & m) return Piece::from_index(i);
        return std::nullopt;
    }

    U64 board_for(Piece p)  const noexcept { return boards_[p.index()]; }

    U64 occupied_by(Color c) const noexcept {
        U64 r = 0;
        const int base = (c == Color::Black) ? 6 : 0;
        for (int i = base; i < base + 6; ++i) r |= boards_[i];
        return r;
    }

    U64 occupied() const noexcept {
        return occupied_by(Color::White) | occupied_by(Color::Black);
    }

    const std::array<U64, PIECE_COUNT>& raw() const noexcept { return boards_; }

private:
    std::array<U64, PIECE_COUNT> boards_ {0};
};

struct CastlingRights {
    bool kingside  : 1 = true;
    bool queenside : 1 = true;

    bool any() const { return kingside || queenside; }
};
