package rpc_tests

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestChainId(t *testing.T) {
	provider := NewTestConfigBuilder().WithProvider(t).Build().Provider
	chainID, err := provider.ChainID(context.Background())
	assert.NoError(t, err, "Failed to get ChainID")
	assert.NotEmpty(t, chainID, "ChainID should not be empty")
}
