package rpc_tests

import (
	"context"
	"fmt"
	"testing"

	"github.com/NethermindEth/starknet.go/rpc"
)

func TestGetBlock(t *testing.T) {
	provider := NewTestConfigBuilder().WithProvider(t).Build().Provider
	numberOfBlocks := uint64(48043)
	for i := uint64(44260); i < numberOfBlocks; i++ {
		block, err := provider.BlockWithTxHashes(context.Background(), rpc.BlockID{Number: &i})
		if err != nil {
			fmt.Printf("Failed to get block for block %d: %v\n", i, err)
			continue
		}
		blockCasted, ok := block.(*rpc.BlockTxHashes)
		if !ok {
			fmt.Printf("Failed to cast block for block %d\n", i)
			continue
		}

		fmt.Printf("Block number: %+v, Price in wei: %+v\n", blockCasted.BlockNumber, blockCasted.L1GasPrice.PriceInWei)

		if blockCasted.L1GasPrice.PriceInWei == nil {
			fmt.Printf("Block %d: %+v\n", i, block)
		}
	}
}
