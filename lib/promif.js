"use strict";

const debug = require('debug')('promiseIf');

/**
 *
 * @param job
 * @param prev
 * @returns {Promise.<TResult>}
 */
const promiseIf = function promiseIf(job, prev) {
    if (typeof job.test !== typeof Promise){
        const test = job.test;
        job.test = ()=>Promise.resolve(test);
    }
    return job.test(prev)
        .then((test)=>{
            let prom;
            if (test) {
                prom = job.whenTrue(prev);
            } else {
                prom = job.whenFalse(prev);
            }
            debug(`If resolved to "${test}": Promise name: "${job.name}": Previous promise resolve value: ${JSON.stringify(prev)}`);
            return prom;
        });
};

/**
 *
 * @param promIfArray
 * @returns {Promise.<Array>}
 */
const promisesIf  = function promisesIf(promIfArray){
    const values = [];
    let chain = Promise.resolve();
    promIfArray.forEach((promIf)=>{
        chain = chain
            .then((val)=>promiseIf(promIf, val))
            .then((val) => {
                debug(`pushing -> ${val}`);
                values.push(val);
                return Promise.resolve(val);
            });
    });
    return chain.then(()=>Promise.resolve(values));
};

module.exports = {
    promiseIf: promiseIf,
    promisesIf: promisesIf
};
