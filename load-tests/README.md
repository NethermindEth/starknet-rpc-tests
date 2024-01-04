# Starknet node - Simple Load Tests

This repository contains a load test for a RPC Starknet node. The test is performed using k6, a powerful tool designed for testing the performance of APIs.

## Setup
First, make sure you have k6 installed on your machine. Instructions can be found on the official [k6 installation guide](https://k6.io/docs/get-started/installation/).

## Running the Test

```
NODE_URL=http://localhost:6060 LOAD_FACTOR=5 DURATION=30m k6 run test_cases.js
```

In this command:

* `NODE_URL` specifies the target node for the test, such as http://127.0.0.1:6060, where the Starknet node is running(RPC v0.5.0).
* `DURATION` indicates the duration of the test, in the format `Nx`, where `N` is the time in minutes or hours. The scenario is configured to increase the load linearly over this specified duration, gradually adding more virtual users or requests until the end of the period.
* `LOAD_FACTOR` is a parameter to scale up simulation traffic intensity. It multiplies the default traffic to simulate higher loads.
