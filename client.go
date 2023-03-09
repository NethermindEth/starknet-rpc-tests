package starknet_rpc_tests

import (
	"github.com/gavv/httpexpect/v2"
	"os"
	"testing"
)

func NewHTTPClient(t testing.TB) *httpexpect.Expect {
	baseURL := os.Getenv("NODE_ADDRESS")
	if baseURL == "" {
		baseURL = "http://localhost:6060"
	}

	return httpexpect.WithConfig(httpexpect.Config{
		BaseURL:  baseURL,
		Reporter: httpexpect.NewAssertReporter(t),
	})
}
