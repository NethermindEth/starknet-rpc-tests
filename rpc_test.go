package starknet_rpc_tests

import (
	"net/http"
	"testing"
)

func TestChainId(t *testing.T) {
	var request = request{
		JsonRpc: "2.0",
		Method:  "starknet_chainId",
		Params:  nil,
		Id:      123,
	}

	var expectedResponse = response{
		JsonRpc: "2.0",
		Result:  "0x534e5f4d41494e",
		Error:   nil,
		Id:      123,
	}

	NewHTTPClient(t).POST("/").
		WithJSON(request).
		Expect().
		Status(http.StatusOK).
		JSON().Object().IsEqual(expectedResponse)
}

func TestBlockNumber(t *testing.T) {
	var request = request{
		JsonRpc: "2.0",
		Method:  "starknet_blockNumber",
		Params:  nil,
		Id:      123,
	}

	var expectedResponse = response{
		JsonRpc: "2.0",
		Result:  21684,
		Error:   nil,
		Id:      123,
	}

	var response = NewHTTPClient(t).POST("/").
		WithJSON(request).
		Expect().
		Status(http.StatusOK).
		JSON().Object()

	response.NotContainsKey("error")
	response.Value("jsonrpc").IsEqual(expectedResponse.JsonRpc)
	response.Value("id").IsEqual(expectedResponse.Id)
	response.Value("result").IsNumber()
}

func TestGetBlockTransactionByHash(t *testing.T) {
	var request = request{
		JsonRpc: "2.0",
		Method:  "starknet_getTransactionByHash",
		Params:  map[string]string{"transaction_hash": "0x376ff82431b52ca1fbc4942de80bc1b01d8e5cd1eeab5a277b601b510f2cab2"},
		Id:      123,
	}

	var expectedResponse = response{
		JsonRpc: "2.0",
		Result: map[string]interface{}{
			"transaction_hash":     "0x376ff82431b52ca1fbc4942de80bc1b01d8e5cd1eeab5a277b601b510f2cab2",
			"type":                 "INVOKE",
			"version":              "0x0",
			"max_fee":              "0x0",
			"contract_address":     "0x6ee3440b08a9c805305449ec7f7003f27e9f7e287b83610952ec36bdc5a6bae",
			"signature":            []interface{}{},
			"calldata":             []interface{}{"0x1e2cd4b3588e8f6f9c4e89fb0e293bf92018c96d7a93ee367d29a284223b6ff", "0x71d1e9d188c784a0bde95c1d508877a0d93e9102b37213d1e13f3ebc54a7751"},
			"entry_point_selector": "0x3d7905601c217734671143d457f0db37f7f8883112abd34b92c4abfeafde0c3",
		},
		Error: nil,
		Id:    123,
	}

	NewHTTPClient(t).POST("/").
		WithJSON(request).
		Expect().
		Status(http.StatusOK).
		JSON().Object().IsEqual(expectedResponse)
}

func TestGetBlockTransactionCount(t *testing.T) {
	var request = request{
		JsonRpc: "2.0",
		Method:  "starknet_getBlockTransactionCount",
		Params: []map[string]string{
			{
				"block_hash": "0x24c692acaed3b486990bd9d2b2fbbee802b37b3bd79c59f295bad3277200a83",
			},
		},
		Id: 123,
	}

	var expectedResponse = response{
		JsonRpc: "2.0",
		Result:  52,
		Error:   nil,
		Id:      123,
	}

	NewHTTPClient(t).POST("/").
		WithJSON(request).
		Expect().
		Status(http.StatusOK).
		JSON().Object().IsEqual(expectedResponse)
}
