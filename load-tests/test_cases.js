import {
    getLatestBlockNumber, getChainId, getStateUpdate, getSyncStatus,
    getNonce, getTransactionByBlockIdAndIndex, getBlockWithTxHashes,
    getTransactionByHash, getTransactionReceipt, getBlockHashAndNumber,
    getBlockWithTxs, getBlockTransactionCount, getStorageAt, getClassHashAt,
    getClass, getClassAt, getEvents, starknetCall, starknetEstimateFee, starknetEstimateMessageFee,
    starknetTraceTransaction, starknetSimulateTransactions, starknetTraceBlockTransactions
} from './starknet_rpc.js';
import { getRandomInt } from './utils.js';
import { createScenario } from './scenarios.js';
import { rates } from './config.js';
import { contractAddresses, txnHashes } from './testdata_mainnet.js';

export const options = {
    scenarios: {
          fetchClassAndCall: createScenario('fetchClassAndCall', rates.starknet_call, 30000),
          //fetchChainAndSyncStatus: createScenario('fetchChainAndSyncStatus', rates.starknet_chainId),
          //getClassHashAt: createScenario('fetchClassHashAt', rates.starknet_getClassHashAt),
          //fetchRandomBlockAndTransactions: createScenario('fetchRandomBlockAndTransactions', rates.starknet_getTransactionReceipt),
          //fetchNonce: createScenario('fetchNonce', rates.starknet_getNonce),
          //fetchStorageAt: createScenario('fetchStorageAt', rates.starknet_getStorageAt),
          //fetchEvents: createScenario('fetchEvents', rates.starknet_getEvents),
          //testEstimateFee: createScenario('testEstimateFee', rates.starknet_estimateFee),
          //fetchTxnReceipt: createScenario('fetchTxnReceipt', rates.starknet_getTransactionReceipt),
          //fetchClassAt: createScenario('fetchClassAt', rates.starknet_getClassAt),
          //testSimulateTransactions: createScenario('testSimulateTransactions', rates.starknet_simulateTransaction),
          //testTrace: createScenario('testTrace', rates.starknet_traceTransaction),
          testTraceBlockTransactions: createScenario('testTraceBlockTransactions', rates.starknet_traceBlockTransactions, 10),
    },
};


export async function fetchClassAt()
{
    const contractAddress = contractAddresses[Math.floor(Math.random() * contractAddresses.length)];

    return getClassAt("pending", contractAddress); 
}

export async function fetchTxnReceipt() {
    const randomTxnHash = txnHashes[Math.floor(Math.random() * txnHashes.length)];

    return getTransactionReceipt(randomTxnHash); 
}

export async function fetchClassHashAt()
{
    const contractAddress = contractAddresses[Math.floor(Math.random() * contractAddresses.length)];

    getClassHashAt("pending", contractAddress);
}

export async function fetchClassAndCall() {
    const contractAddress = contractAddresses[Math.floor(Math.random() * contractAddresses.length)];
    //balance of
    starknetCall("pending", "0x049D36570D4e46f48e99674bd3fcc84644DdD6b96F7C741B1562B82f9e004dC7", "0x02e4263afad30923c891518314c3c95dbe830a16874e8abc5777a9a20b54c76e", [contractAddress]);
}

export async function fetchRandomBlockAndTransactions() {
    const randomBlock = await getRandomBlock();
    const randomTxn = getRandomTransaction(randomBlock);

    getBlockHashAndNumber();
    getTransactionByHash(randomTxn.transaction_hash);
    getTransactionReceipt(randomTxn.transaction_hash);
    getBlockWithTxs(randomBlock.block_hash);
}

export function fetchChainAndSyncStatus() {
    getChainId();
    getSyncStatus();
}

export async function fetchNonce() {
    const contractAddress = contractAddresses[Math.floor(Math.random() * contractAddresses.length)];

    getNonce("pending", contractAddress);
}

export async function fetchStorageAt() {
    const randomBlock = await getRandomBlock();
    const stateUpdate = await getStateUpdate(randomBlock.block_hash).result;

    const randomStorageDiffIndex = getRandomInt(stateUpdate.state_diff.storage_diffs.length);
    const randomStorageDiff = stateUpdate.state_diff.storage_diffs[randomStorageDiffIndex];

    const randomStorageEntryIndex = getRandomInt(randomStorageDiff.storage_entries.length);
    const randomStorageEntry = randomStorageDiff.storage_entries[randomStorageEntryIndex];

    getStorageAt(randomBlock.block_hash, randomStorageDiff.address, randomStorageEntry.key);
}

export async function fetchEvents() {
    const randomBlock = await getRandomBlock();
    const randomTransaction = await getRandomTransaction(randomBlock);
    const contractAddress = getAddressBasedOnTxnType(randomTransaction);
    const latestBlockNumber = await getLatestBlockNumber().result;
    
    let allEvents = getEvents(latestBlockNumber-1000, latestBlockNumber, contractAddress, null, 100).result.events;

    if (allEvents.length > 0) {
        const randomIndex = getRandomInt(allEvents.length);
        const keys = allEvents[randomIndex].keys;
        getEvents(latestBlockNumber-1000, latestBlockNumber, contractAddress, keys, 100);
    }
}

export async function testEstimateFee() {
    const randomBlock = await getRandomBlock();
    const transactions = getBlockWithTxs(randomBlock.block_number).result.transactions;
    let filteredTransactions = [];

    //estimate only first 2 txns, as estimating whole blocks is too heavy
    transactions.slice(0, 2).forEach(txn => {
        if (txn.type === "L1_HANDLER") {
            starknetEstimateMessageFee(txn.calldata[0], txn.contract_address, txn.entry_point_selector, txn.calldata.slice(1), randomBlock.block_number - 1);
            return;
        }

        if (txn.type === "DECLARE") {
            let block_id = {
                block_number: blockNumber
            };
            const getClassResponse = getClassAt(block_id, txn.class_hash);
            txn.contract_class = getClassResponse.result;
        }

        if (txn.type === "DEPLOY") {
            console.warn("Can't estimate DEPLOY txn type: ", txn);
            return;
        }

        filteredTransactions.push(txn);
    });

    if (filteredTransactions.length > 0) {
        starknetEstimateFee(filteredTransactions, randomBlock.block_number - 1);
    }
}

export async function testSimulateTransactions() {
    const randomBlock = await getRandomBlock();
    const transactions = getBlockWithTxs(randomBlock.block_number).result.transactions;

    let filteredTransactions = [];

    //estimate only first 2 txns, as estimating whole blocks is too heavy
    transactions.slice(0, 2).forEach(txn => {
        if (txn.type === "L1_HANDLER") {
            console.info("L1_HANDLER txn type cannot be simulate: ", txn);
            return;
        }

        if (txn.type === "DECLARE") {
            const getClassResponse = getClassAt(randomBlock.block_number, txn.class_hash);
            txn.contract_class = getClassResponse.result;
        }

        if (txn.type === "DEPLOY") {
            console.info("Can't simulate legacy DEPLOY txn type: ", txn);
            return;
        }

        filteredTransactions.push(txn);
    });

    if (filteredTransactions.length > 0) {
        starknetSimulateTransactions(filteredTransactions, randomBlock.block_number - 1);
    }
}

export async function testTrace() {
    const randomBlock = await getRandomBlock();
    const randomTxn = getRandomTransaction(randomBlock);

    starknetTraceTransaction(randomTxn.transaction_hash)
}

export async function testTraceBlockTransactions() {
    const randomBlock = await getRandomBlock();

    starknetTraceBlockTransactions("pending");
}

async function getRandomBlock() {
    const latestBlockNumber = await getLatestBlockNumber().result;
    //take data from only last 10k blocks
    const randomBlockNumber = getRandomInt(latestBlockNumber, latestBlockNumber - 10000);

    let block_id = {
        block_number: randomBlockNumber 
    };
    
    return getBlockWithTxHashes(block_id).result;
}

function getRandomTransaction(block) {
    const transactionCount = getBlockTransactionCount(block.block_hash).result;

    return getTransactionByBlockIdAndIndex(block.block_hash, getRandomInt(transactionCount)).result;
}

function getAddressBasedOnTxnType(txn) {
    if (txn.type === "INVOKE" && txn.version !== "0x0") {
        return txn.sender_address;
    }

    if (txn.type === "DEPLOY" || txn.type === "DEPLOY_ACCOUNT") {
        var txnReceipt = getTransactionReceipt(txn.transaction_hash);
        return txnReceipt.result.contract_address;
    }

    return txn.contract_address;
}