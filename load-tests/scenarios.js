import { duration } from './config.js';

export function createScenario(execName, target, maxVUs = 1) {
    return {
        exec: execName,
        executor: 'constant-arrival-rate',
        rate: target,
        timeUnit: '5s',
        duration: duration,
        preAllocatedVUs: 1,
        maxVUs: maxVUs
    };
}