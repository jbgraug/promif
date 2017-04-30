'use strict';

const debug = require('debug')('when');

/**
 * @function when
 * @param {Object} job
 * @param {string} job.name
 * @param {Function} job.test
 * @param {Function} job.whenTrue
 * @param {Function} job.whenFalse
 * @param {*} [prev] - Initial value available in the promise
 * @returns {Promise.<Array.<*>>}
 */
const when = function when(job, prev) {
    if(typeof job !== 'object'){
        job = {};
    }
    if (typeof job.test !== typeof Promise){
        const test = job.test;
        job.test = ()=>Promise.resolve(test);
    }
    return job.test(prev)
        .then((test)=>{
            let prom;
            if (test) {
                if(typeof job.whenTrue !== 'function'){
                    prom = Promise.reject(new Error(`WhenTrue was triggered but it was not Promise function, prev:${prev}`));
                } else {
                    prom = job.whenTrue(prev);
                }
            } else {
                if(typeof job.whenFalse !== 'function'){
                    prom = Promise.reject(new Error(`WhenFalse was triggered but it was not Promise function, prev:${prev}`));
                } else {
                    prom = job.whenFalse(prev);
                }
            }
            debug(`If resolved to "${test}": Promise name: "${job.name}": Previous promise resolve value: ${JSON.stringify(prev)}`);
            return prom;
        });
};

/**
 * @function
 * @param {Array.<Object>} jobArray - Array of promif.when Objects
 * @param {string} jobArray[].name - name for debug pourposes
 * @param {function(*)} jobArray[].test - the test
 * @param {function(*)} jobArray[].whenTrue - promise for true condition
 * @function {function(*)} jobArray[].whenFalse - promise for false condition
 * @returns {Promise.<Array.<*>>}
 */
const serial  = function serial(jobArray){
    if(!Array.isArray(jobArray)) {
        jobArray = [];
    }
    const values = [];
    let chain = Promise.resolve();
    jobArray.forEach((promIf)=>{
        chain = chain
            .then((val)=>when(promIf, val))
            .then((val) => {
                debug(`pushing -> ${val}`);
                values.push(val);
                return Promise.resolve(val);
            });
    });
    return chain.then(()=>Promise.resolve(values));
};

module.exports = {
    when: when,
    serial: serial
};
