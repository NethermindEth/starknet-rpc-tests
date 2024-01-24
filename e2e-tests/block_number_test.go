package rpc_tests

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestBlockNumber(t *testing.T) {
	provider := NewTestConfigBuilder().WithProvider(t).Build().Provider
	blockNumber, err := provider.BlockNumber(context.Background())
	assert.NoError(t, err, "Failed to get blockNumber")
	assert.NotEqual(t, 0, blockNumber, "blockNumber should not be zero")
}
