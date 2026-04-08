#include "../include/Position.hpp"
#include "../include/FEN.hpp"
#include "../include/Engine.hpp"

#include <print>
#include <cstdint>
#include <iostream>

auto parseArgs(int argc, char* argv[]) -> std::string {
    std::string fen;
    for (int i = 1; i < argc; ++i) {
        if (!fen.empty()) fen += ' ';
        fen += argv[i];
    }
    return fen;
}

auto to_rc = [](uint8_t sq) -> std::pair<int, int> {
    return {7 - (sq / 8), sq % 8 };
};

auto main(int argc, char* argv[]) -> int {

    const std::string fen = parseArgs(argc, argv);
    Position pos = fen::parse(fen);

    Engine engine;
    auto m = engine.bestMove(pos);

    auto [fr, fc] = to_rc(m.from);
    auto [tr, tc] = to_rc(m.to);

    std::println("{},{}:{},{}", fr, fc, tr, tc);

    return 0;
}
