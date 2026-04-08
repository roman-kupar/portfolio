#pragma once
#include "evaluator/evaluator.hpp"
#include "evaluator/terms/material_term.hpp"
#include "algorithm/negamax.hpp"
#include <memory>
#include <stdexcept>

class Engine {
private:
	Negamax strategy;

public:
	explicit Engine()
		: strategy() {
	}

	Move bestMove(const Position& position) {
		auto result = strategy.search(position);
		if (!result)
			throw std::runtime_error("no legal moves in position");
		return *result;
	}
};