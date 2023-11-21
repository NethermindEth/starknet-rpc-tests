export const NODE_URL = __ENV.NODE_URL || 'http://localhost:6060';
export const duration = __ENV.DURATION || '30m';
export const factor = __ENV.LOAD_FACTOR || '1';

// Rates for various methods/scenarios
export const rates = {
    'starknet_call': 200 * factor,
    'starknet_getTransactionReceipt': 20 * factor,
    'starknet_blockNumber': 50 * factor,
    'starknet_getEvents': 20 * factor,
    'starknet_chainId': 40 * factor,
    'starknet_getBlockWithTxHashes': 40 * factor,
    'starknet_getBlockWithTxs': 40 * factor,
    'starknet_getNonce': 10 * factor,
    'starknet_syncing': 50 * factor,
    'starknet_estimateFee': 1 * factor,
    'starknet_getClassAt': 5 * factor,
    'starknet_getClass': 60 * factor,
    'starknet_getClassHashAt': 5 * factor,
    'starknet_getStateUpdate': 40 * factor,
    'starknet_blockHashAndNumber': 40 * factor,
    'starknet_getStorageAt': 30 * factor,
    'starknet_getBlockByNumber': 30 * factor,
    'starknet_getTransactionByHash': 15 * factor,
    'starknet_getBlockTransactionCount': 10 * factor,
    'starknet_getTransactionByBlockIdAndIndex': 10 * factor,
    'starknet_getTransactionStatus': 10 * factor,
    'starknet_simulateTransaction': 1 * factor,
    'starknet_traceBlockTransactions': 1 * factor,
    'starknet_traceTransaction': 1 * factor,
};