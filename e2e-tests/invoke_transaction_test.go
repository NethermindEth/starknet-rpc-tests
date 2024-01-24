package rpc_tests

import (
	"context"
	"testing"

	"github.com/NethermindEth/starknet.go/rpc"
	"github.com/NethermindEth/starknet.go/utils"
	"github.com/stretchr/testify/assert"
)

const (
	TestContractAddress = "0x4c1337d55351eac9a0b74f3b8f0d3928e2bb781e5084686a892e66d49d510d"
	TestCairoVersion    = 0
	TestContractMethod  = "increase_value"
	TestMaxFee          = "0x9184e72a000"
)

func TestAddInvokeTxn(t *testing.T) {
	config := NewTestConfigBuilder().WithProvider(t).WithAccount(t).Build()

	maxFee, err := utils.HexToFelt(TestMaxFee)
	if err != nil {
		t.Fatalf("Failed to convert maxFee to felt: %v", err)
	}
	contractAddress, err := utils.HexToFelt(TestContractAddress)
	if err != nil {
		t.Fatalf("Failed to convert contract address to felt: %v", err)
	}

	fnCall := rpc.FunctionCall{
		ContractAddress:    contractAddress,
		EntryPointSelector: utils.GetSelectorFromNameFelt(TestContractMethod),
	}

	nonce, err := config.Account.Nonce(context.Background(), rpc.BlockID{Tag: "pending"}, config.Account.AccountAddress)
	if err != nil {
		t.Fatalf("Failed to get nonce: %v", err)
	}

	invokeTx := rpc.InvokeTxnV1{
		MaxFee:        maxFee,
		Version:       rpc.TransactionV1,
		Type:          rpc.TransactionType_Invoke,
		SenderAddress: config.Account.AccountAddress,
		Nonce:         nonce,
	}
	invokeTx.Calldata, err = config.Account.FmtCalldata([]rpc.FunctionCall{fnCall}, TestCairoVersion)
	if err != nil {
		t.Fatalf("Failed to format calldata: %v", err)
	}

	err = config.Account.SignInvokeTransaction(context.Background(), &invokeTx)
	if err != nil {
		t.Fatalf("Failed to sign the transaction: %v", err)
	}

	resp, err := config.Account.AddInvokeTransaction(context.Background(), invokeTx)
	assert.NoError(t, err, "Failed to add invoke transaction")
	assert.NotEmpty(t, resp.TransactionHash, "Transaction hash should not be empty")
}
