#pragma once
#include "../MoveGenerator.hpp"
#include "../engine_core/constants.hpp"
#include "../evaluator/evaluator.hpp"
#include <optional>
#include <algorithm>
#include <array>
#include <vector>
#include <chrono>

// Transposition table entry
enum class TTFlag : uint8_t { Exact, LowerBound, UpperBound };

struct TTEntry {
    uint64_t hash      = 0;
    Move     best_move = Move::null();
    int16_t  score     = 0;
    int8_t   depth     = 0;
    TTFlag   flag      = TTFlag::Exact;
};

class Negamax {
private:
    Evaluator _eval;
    int       _depth;

    // Time limit
    std::chrono::steady_clock::time_point _start_time;
    std::chrono::milliseconds _time_limit{3000}; // 3 seconds at maximum for AI move

    mutable bool     _time_up = false;
    mutable uint64_t _nodes = 0; 

    // Transposition table
    static constexpr size_t TT_SIZE = 1 << 18; // 262,144
    mutable std::vector<TTEntry> _tt;

    static constexpr int MAX_DEPTH = 64;
    mutable std::array<std::array<Move, 2>, MAX_DEPTH> _killers{};

    // History heuristic table [piece_type][to_square]
    mutable std::array<std::array<int, 64>, 12> _history{};

    // Piece evaluation
    static int piece_val(PieceType t) noexcept {
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

    
    // Move evaluation
    int move_score(const Move& m, int ply, const std::optional<Move>& tt_move) const {
        if (tt_move && m == *tt_move) return 2'000'000;

        if (m.captured)
            return 1'000'000 + piece_val(m.captured->type) * 10 - piece_val(m.piece.type);

        if (m == _killers[ply][0]) return 900'000;
        if (m == _killers[ply][1]) return 800'000;

        return _history[static_cast<int>(m.piece.type)][m.to];
    }

    // Quiescence search
    int quiesce(const Position& pos, int alpha, int beta) const {
        if ((_nodes++ & 2047) == 0) { // Check time every ~2000 nodes
            if (std::chrono::steady_clock::now() - _start_time > _time_limit) {
                _time_up = true;
            }
        }
        if (_time_up) return 0; // Time's up, fallback

        int stand_pat = _eval.evaluate(pos);
        if (stand_pat >= beta) return beta;
        alpha = std::max(alpha, stand_pat);

        MoveGenerator gen(pos);
        auto moves = gen.legal_moves();

        // Keep only captures
        std::erase_if(moves, [](const Move& m) { return !m.captured; });

        std::sort(moves.begin(), moves.end(), [](const Move& a, const Move& b) {
            return piece_val(a.captured->type) - piece_val(a.piece.type) >
                   piece_val(b.captured->type) - piece_val(b.piece.type);
        });

        for (const Move& m : moves) {
            int score = -quiesce(pos.apply(m), -beta, -alpha);
            if (_time_up) return 0;
            if (score >= beta) return beta;
            alpha = std::max(alpha, score);
        }
        return alpha;
    }

    // Core negamax
    struct Result {
        int                 score     = NEG_INF;
        std::optional<Move> best_move = std::nullopt;
    };

    Result negamax(const Position& pos, int depth, int alpha, int beta, int ply) const {
        if ((_nodes++ & 2047) == 0) {
            if (std::chrono::steady_clock::now() - _start_time > _time_limit) {
                _time_up = true;
            }
        }
        if (_time_up) return {0, std::nullopt};

        const int      orig_alpha = alpha;
        const uint64_t hash       = pos.hash;
        const auto     tt_idx     = hash % TT_SIZE;

        std::optional<Move> tt_move;
        if (const auto& entry = _tt[tt_idx]; entry.hash == hash) {
            if (entry.best_move != Move::null())
                tt_move = entry.best_move;

            if (entry.depth >= depth) {
                const int s = static_cast<int>(entry.score);
                if (entry.flag == TTFlag::Exact)      return { s, tt_move };
                if (entry.flag == TTFlag::LowerBound) alpha = std::max(alpha, s);
                if (entry.flag == TTFlag::UpperBound) beta  = std::min(beta,  s);
                if (alpha >= beta)                    return { s, tt_move };
            }
        }

        if (depth == 0)
            return { quiesce(pos, alpha, beta), std::nullopt };

        MoveGenerator gen(pos);
        auto moves = gen.legal_moves();

        if (moves.empty()) {
            if (gen.is_in_check(pos.side_to_move))
                return { -CHECKMATE - depth, std::nullopt };
            return { 0, std::nullopt };
        }

        std::sort(moves.begin(), moves.end(), [&](const Move& a, const Move& b) {
            return move_score(a, ply, tt_move) > move_score(b, ply, tt_move);
        });

        Result best;
        for (const Move& m : moves) {
            const int score = -negamax(pos.apply(m), depth - 1, -beta, -alpha, ply + 1).score;
            if (_time_up) return {0, std::nullopt}; // abort instantly

            if (score > best.score) {
                best.score     = score;
                best.best_move = m;
            }
            alpha = std::max(alpha, score);

            if (alpha >= beta) {
                if (!m.captured) {
                    _killers[ply][1] = _killers[ply][0];
                    _killers[ply][0] = m;
                    auto& h = _history[static_cast<int>(m.piece.type)][m.to];
                    h = std::min(h + depth * depth, 1'000'000);
                }
                break;
            }
        }

        TTFlag flag;
        if      (best.score <= orig_alpha) flag = TTFlag::UpperBound;
        else if (best.score >= beta)       flag = TTFlag::LowerBound;
        else                               flag = TTFlag::Exact;

        _tt[tt_idx] = {
            hash,
            best.best_move.value_or(Move::null()),
            static_cast<int16_t>(best.score),
            static_cast<int8_t>(depth),
            flag
        };

        return best;
    }

public:
    explicit Negamax(int depth = 50) 
        : _eval(), _depth(depth), _tt(TT_SIZE) {}

    std::optional<Move> search(const Position& pos) {
        for (auto& row : _history)
            for (auto& h : row)
                h >>= 1;

        _start_time = std::chrono::steady_clock::now();
        _time_up = false;
        _nodes = 0;

        std::optional<Move> best_overall;

        for (int d = 1; d <= _depth; ++d) {
            auto result = negamax(pos, d, NEG_INF, INF, 0);

            // If time ran out during this depth iteration, break the loop
            // and return the best move found in the *previous* fully completed depth.
            if (_time_up) {
                break;
            }

            if (result.best_move) {
                best_overall = result.best_move;
            }
        }

        return best_overall;
    }
};