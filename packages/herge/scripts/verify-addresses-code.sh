#!/bin/bash
# Verify all addresses in deployment documentation have code deployed

RPC_URL="${ARBITRUM_SEPOLIA_RPC_URL:-https://sepolia-rollup.arbitrum.io/rpc}"
ADDRESSES_FILE="deployments/arbitrum-sepolia/.addresses.json"

echo "🔍 Verifying all deployed contract addresses have code..."
echo "📡 RPC URL: $RPC_URL"
echo ""

if ! command -v cast &> /dev/null; then
    echo "❌ Error: 'cast' command not found. Please install foundry:"
    echo "   curl -L https://foundry.paradigm.xyz | bash"
    exit 1
fi

# Check if addresses file exists
if [ ! -f "$ADDRESSES_FILE" ]; then
    echo "❌ Error: Addresses file not found: $ADDRESSES_FILE"
    exit 1
fi

# Extract all addresses from JSON file
addresses=$(jq -r '.[]' "$ADDRESSES_FILE" 2>/dev/null)

if [ -z "$addresses" ]; then
    echo "❌ Error: Could not extract addresses from $ADDRESSES_FILE"
    exit 1
fi

total=$(echo "$addresses" | wc -l | tr -d ' ')
echo "📊 Total addresses to verify: $total"
echo ""

# Counter
verified=0
no_code=0
errors=0
invalid_addresses=()

# Check each address
for address in $addresses; do
    # Skip empty lines
    if [ -z "$address" ]; then
        continue
    fi
    
    # Check if address is valid format
    if [[ ! "$address" =~ ^0x[0-9a-fA-F]{40}$ ]]; then
        echo "⚠️  Invalid address format: $address"
        ((errors++))
        continue
    fi
    
    # Get contract code
    code=$(cast code "$address" --rpc-url "$RPC_URL" 2>&1)
    
    if [ $? -ne 0 ]; then
        echo "❌ Error checking $address: $code"
        invalid_addresses+=("$address (ERROR)")
        ((errors++))
    elif [ "$code" = "0x" ] || [ -z "$code" ] || [ "$code" = "0x0" ]; then
        echo "❌ No code at $address"
        invalid_addresses+=("$address (NO CODE)")
        ((no_code++))
    else
        # Extract first 4 bytes of code (function selector)
        code_length=${#code}
        if [ "$code_length" -gt 10 ]; then
            echo "✅ $address - Code deployed (${code_length} chars)"
            ((verified++))
        else
            echo "⚠️  $address - Suspicious code length: $code_length"
            invalid_addresses+=("$address (SUSPICIOUS)")
            ((no_code++))
        fi
    fi
    
    # Small delay to avoid rate limiting
    sleep 0.1
done

echo ""
echo "════════════════════════════════════════════════════════════"
echo "📊 Verification Summary"
echo "════════════════════════════════════════════════════════════"
echo "✅ Verified (has code): $verified"
echo "❌ No code: $no_code"
echo "⚠️  Errors: $errors"
echo "📊 Total checked: $total"
echo ""

if [ ${#invalid_addresses[@]} -gt 0 ]; then
    echo "❌ Addresses with issues:"
    for addr in "${invalid_addresses[@]}"; do
        echo "   - $addr"
    done
    echo ""
    exit 1
else
    echo "✅ All addresses have code deployed!"
    exit 0
fi

