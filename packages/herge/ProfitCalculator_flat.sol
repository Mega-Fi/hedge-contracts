WARNING: You are currently using Node.js v21.6.1, which is not supported by Hardhat. This can lead to unexpected behavior. See https://v2.hardhat.org/nodejs-versions


// Sources flattened with hardhat v2.26.5 https://hardhat.org

// File contracts/Strategies/ProfitCalculator.sol

pragma solidity ^0.8.3;

/**
 * SPDX-License-Identifier: GPL-3.0-or-later
 * Hegic
 * Copyright (C) 2022 Hegic Protocol
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/

library ProfitCalculator {
    function calculatePutProfit(
        uint256 strike,
        uint256 currentPrice,
        uint256 amount,
        uint256 tokenDen,
        uint256 spotDen,
        uint256 priceDen
    ) public pure returns (uint256) {
        if (currentPrice > strike) return 0;
        return
            ((strike - currentPrice) * amount * tokenDen) / spotDen / priceDen;
    }

    function calculateCallProfit(
        uint256 strike,
        uint256 currentPrice,
        uint256 amount,
        uint256 tokenDen,
        uint256 spotDen,
        uint256 priceDen
    ) public pure returns (uint256) {
        if (currentPrice < strike) return 0;
        return
            ((currentPrice - strike) * amount * tokenDen) / spotDen / priceDen;
    }
}

The following file(s) do NOT specify SPDX licenses: contracts/Strategies/ProfitCalculator.sol
