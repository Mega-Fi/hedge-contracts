#!/bin/bash
# Flatten contracts for manual verification on Arbiscan

echo "🔧 Flattening contracts for verification..."
echo ""

CONTRACTS=(
  "CoverPool:contracts/CoverPool.sol"
  "OperationalTreasury:contracts/OperationalTreasury.sol"
  "PositionsManager:contracts/PositionsManager/PositionsManager.sol"
  "ProfitCalculator:contracts/Strategies/ProfitCalculator.sol"
  "LimitController:contracts/Strategies/LimitController.sol"
  "ProfitDistributor:contracts/ProfitDistributor.sol"
)

for contract in "${CONTRACTS[@]}"; do
  IFS=':' read -r name path <<< "$contract"
  echo "📝 Flattening $name..."
  npx hardhat flatten "$path" > "${name}_flat.sol" 2>&1
  
  # Check for duplicates
  spdx_count=$(grep -c "SPDX-License-Identifier" "${name}_flat.sol" || echo "0")
  if [ "$spdx_count" -gt "1" ]; then
    echo "  ⚠️  Warning: Found $spdx_count SPDX licenses (remove duplicates manually)"
  else
    echo "  ✅ Flattened successfully"
  fi
  
  line_count=$(wc -l < "${name}_flat.sol" | tr -d ' ')
  echo "  📊 Lines: $line_count"
  echo ""
done

echo "✅ All contracts flattened!"
echo ""
echo "📋 Next steps:"
echo "   1. Review flattened files and remove duplicate SPDX licenses"
echo "   2. Go to https://sepolia.arbiscan.io/verifyContract"
echo "   3. Follow the manual verification guide: MANUAL_VERIFICATION_GUIDE.md"
echo ""

