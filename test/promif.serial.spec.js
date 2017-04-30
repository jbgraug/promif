'use strict';

const promif = require('../lib/promif');

describe('serial', ()=> {
    const pif1 = {
        test: false,
        whenFalse: ()=>Promise.resolve(2)
    };
    const pif2 = {
        test: () => new Promise((resolve) => {
            setTimeout(() => resolve(true), 30);
        }),
        whenTrue: (val1) => Promise.resolve(2 * val1)
    };
    const pif3 = {
        test: true,
        whenTrue: (val2) => new Promise((resolve) => {
            setTimeout(() => resolve(3 * val2), 10);
        }),
        whenFalse: () => Promise.reject('Error pif3')
    };

    const pif4 = {
        test: true,
        whenTrue: (val2) => new Promise((resolve) => {
            setTimeout(() => resolve(3 * val2), 20);
        }),
        whenFalse: () => Promise.reject('Error pif3')
    };

    it('checks serial',(done)=> {
        promif.serial([pif1, pif2, pif3])
            .then((res) => {
                expect(res.length).toBe(3);
                expect(res[0]).toBe(2);
                expect(res[1]).toBe(4);
                expect(res[2]).toBe(12);
                done();
            });
    });

    it('checks called with no parameters resolves',(done)=> {
        promif.serial()
            .then(()=>done())
            .catch((e)=>done.fail('shouldnt be an error ', e.message));
    });

});