# Promif

Promif controls your workflow control using promises (even for the test expression).

## promif.when

### How it works

Async test function:

    const promif = require('promif');
    const asyncTestFunction = () => {
        return new Promise(resolve=>{setTimeout(()=>resolve(true),500)});
     };

    promif.when({
        test: asyncTestFunction,
        whenTrue: ()=>Promise.resolve(true),
        whenFalse: ()=>Promise.resolve(false)
    }).then((res)=>{
        // after 500ms => res = true!
        console.log(res)
    });
    
Sync test
    
    const promif = require('promif');
    let x = 23;
    
    promif.when({
        test: x === 23, // Sync test (expression)
        whenTrue: ()=>Promise.resolve('Yahoo'),
        whenFalse: ()=>Promise.resolve(false)
    }).then((res)=>{
        // res = 'Yahoo'!
        console.log(res);
    });

** Both whenTrue & whenFalse must be functions returning Promise (will be resolved or rejected);

## promif.serial

Run sequentially an array of preformated objects like in promif.when
Every promise gets the result of the previous resolved promise

### How it works

        
    const promif = require('promif');
    
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
    
    
    promif.serial([pif1, pif2, pif3])
        .then((res) => {
            // 2 * 2 * 3 
            // Array whith all intermetiate values (each promise)
            // res = [2,4,12]
            console.log(res);
        })
        .catch((e)=>{
            // no error
            console.error(e);
        });

 
 










