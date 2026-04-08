#pragma once
#include "../engine_core/types.hpp"
#include "../engine_core/constants.hpp"
#include "terms/material_term.hpp"

class Evaluator {
public:
    Evaluator() = default;

    int evaluate(const Position& pos) const noexcept {
        const Color us = pos.side_to_move;
        const Color them = opponent(us);

        return material_.score(pos, us) - material_.score(pos, them);
    }

private:
    MaterialTerm material_;
};
