package rpc_tests

import (
	"fmt"
	"math/big"
	"os"
	"testing"

	"github.com/NethermindEth/starknet.go/account"
	"github.com/NethermindEth/starknet.go/curve"
	"github.com/NethermindEth/starknet.go/rpc"
	"github.com/NethermindEth/starknet.go/utils"
)

type TestConfig struct {
	Provider *rpc.Provider
	Account  *account.Account
}

type TestConfigBuilder struct {
	config *TestConfig
}

func NewTestConfigBuilder() *TestConfigBuilder {
	return &TestConfigBuilder{config: &TestConfig{}}
}

func (b *TestConfigBuilder) WithProvider(t *testing.T) *TestConfigBuilder {
	var err error
	b.config.Provider, err = rpc.NewProvider(os.Getenv("TEST_RPC_URL"))
	if err != nil {
		t.Fatal("Failed to get TEST_RPC_URL")
	}
	return b
}

func (b *TestConfigBuilder) WithAccount(t *testing.T) *TestConfigBuilder {
	privateKey := os.Getenv("TEST_ACCOUNT_PRIVATE_KEY")
	accountAddress, err := utils.HexToFelt(os.Getenv("TEST_ACCOUNT_ADDRESS"))
	if err != nil {
		panic(err.Error())
	}

	ks := account.NewMemKeystore()
	privKeyBigInt, ok := new(big.Int).SetString(privateKey, 0)
	if !ok {
		t.Fatal("Failed to parse private key")
	}

	publicKey, err := GetPublicKeyFromPrivateKey(privKeyBigInt)
	if err != nil {
		t.Fatal("Failed to generate public key from private key")
	}

	ks.Put(publicKey.String(), privKeyBigInt)

	acnt, err := account.NewAccount(b.config.Provider, accountAddress, publicKey.String(), ks, b.config.Account.CairoVersion)
	if err != nil {
		t.Fatal("Failed to create new account")
	}

	b.config.Account = acnt

	return b
}

func (b *TestConfigBuilder) Build() *TestConfig {
	return b.config
}

func GetPublicKeyFromPrivateKey(privateKey *big.Int) (*big.Int, error) {
	pubX, _, err := curve.Curve.PrivateToPoint(privateKey)
	if err != nil {
		return nil, fmt.Errorf("can't generate public key: %w", err)
	}
	return pubX, nil
}
