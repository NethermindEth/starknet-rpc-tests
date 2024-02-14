import http from 'k6/http';
import { NODE_URL } from './config.js';
import { checkSuccessRpcSchema } from './utils.js';

function handleRequest(method, params) {
    let payload = {
        jsonrpc: '2.0',
        method: method,
        params: params,
        id: 1
    };

    let response = http.post(`${NODE_URL}`, JSON.stringify(payload), { tags: { name: method } });

    checkSuccessRpcSchema(response);

    return JSON.parse(response.body);
}

export function getSyncStatus() {
    return handleRequest('starknet_syncing', {});
}

export function getChainId() {
    return handleRequest('starknet_chainId', {});
}

export function getNonce(block_id, contractAddress) {
    return handleRequest('starknet_getNonce', { 
        block_id: block_id,
        contract_address: contractAddress
    });
}

export function getLatestBlockNumber() {
    return handleRequest('starknet_blockNumber', {});
}

export function getBlockWithTxHashes(blockId) {
    return handleRequest('starknet_getBlockWithTxHashes', {block_id: blockId});
}

export function getTransactionByHash(txnHash) {
    return handleRequest('starknet_getTransactionByHash', { "transaction_hash": txnHash });
}

export function getTransactionReceipt(txnHash) {
    return handleRequest('starknet_getTransactionReceipt', { "transaction_hash": txnHash });
}

export function getBlockHashAndNumber() {
    return handleRequest('starknet_blockHashAndNumber', {});
}

export function getBlockWithTxs(blockNumber) {
    return handleRequest('starknet_getBlockWithTxs', [ { "block_number": parseInt(blockNumber, 10) } ]);
}

export function getBlockTransactionCount(blockHash) {
    return handleRequest('starknet_getBlockTransactionCount', [ { "block_hash": blockHash } ]);
}

export function getTransactionByBlockIdAndIndex(blockHash, index) {
    return handleRequest('starknet_getTransactionByBlockIdAndIndex', [ { "block_hash": blockHash }, index ]);
}

export function getStateUpdate(blockHash) {
    return handleRequest('starknet_getStateUpdate', [ { block_hash: blockHash } ]);
}

export function getStorageAt(blockHash, contractAddress, key) {
    return handleRequest('starknet_getStorageAt', {
        block_id: {
            block_hash: blockHash
        },
        contract_address: contractAddress,
        key: key
    });
}

export function getClassHashAt(block_id, contractAddress) {
    return handleRequest('starknet_getClassHashAt', { 
        block_id: block_id,
        contract_address: contractAddress
    });
}

export function getClass(blockHash, classHash) {
    return handleRequest('starknet_getClass', {
        block_id: {
            block_hash: blockHash
        },
        class_hash: classHash
    });
}

export function getClassAt(block_id, contractAddress) {
    return handleRequest('starknet_getClassAt', {
        block_id: block_id,
        contract_address: contractAddress
    });
}

export function getEvents(fromBlock, toBlock, contractAddress, keys, chunkSize) {
    let params = {
        from_block: { block_number: fromBlock },
        to_block: { block_number: toBlock },
        address: contractAddress,
        chunk_size: chunkSize
    };
    
    if (keys) {
        params.keys = [keys];
    }

    return handleRequest('starknet_getEvents', [ params ]);
}

export function starknetCall(block_id, contractAddress, entryPointSelector, calldata=[]) {
    return handleRequest('starknet_call', {
        block_id: block_id,
        request: {
            contract_address: contractAddress,
            entry_point_selector: entryPointSelector,
            calldata: calldata
        }
    });
}

export function starknetEstimateFee(transactions, blockNumber) {
    return handleRequest('starknet_estimateFee', {
        request: transactions,
        block_id: {
            block_number: blockNumber
        }
    });
}

export function starknetEstimateMessageFee(fromAddress, toAddress, entryPointSelector, payload, blockNumber) {
    return handleRequest('starknet_estimateMessageFee', {
        message: {
            from_address: fromAddress,
            to_address: toAddress,
            entry_point_selector: entryPointSelector,
            payload: payload
        },
        block_id: {
            block_number: blockNumber
        }
    });
}

export function starknetTraceTransaction(transactionHash) {
    return handleRequest('starknet_traceTransaction', {
        transaction_hash: transactionHash,
    });
}

export function starknetSimulateTransactions(transactions, blockNumber) {
    return handleRequest('starknet_simulateTransactions', {
        transactions: transactions,
        simulation_flags: [],
        block_id: {
            block_number: blockNumber
        }
    });
}

export function starknetTraceBlockTransactions(block_id)
{
    return handleRequest('starknet_traceBlockTransactions', {
        block_id: block_id,
    });
}