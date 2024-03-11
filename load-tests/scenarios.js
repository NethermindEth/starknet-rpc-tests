import { duration } from './config.js';

export function createScenario(execName, target, maxVUs = 100) {
    return {
        exec: execName,
        executor: 'ramping-arrival-rate',
        startRate: 1,
        timeUnit: `1s`,
        stages: [
            { target: target, duration: duration },
        ],
        preAllocatedVUs: 100,
        maxVUs: maxVUs
    };
}

//constant traffic
// export function createScenario(execName, target, maxVUs = 1000) {
//     return {
//         exec: execName,
//         executor: 'constant-arrival-rate',
//         rate: target,
//         timeUnit: '1s',
//         duration: duration,
//         preAllocatedVUs: 1,
//         maxVUs: maxVUs
//     };
// }