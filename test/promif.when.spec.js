'use strict';

const promif = require('../lib/promif');

describe('when', ()=>{

    it('checks test is true runs resolves whenTrue ',(done)=>{
        promif.when({
            name: '',
            test: true,
            whenTrue: ()=>Promise.resolve(0),
            whenFalse: ()=>Promise.resolve(1)
        }).then((res)=>{
            expect(res).toBe(0);
            done();
        });
    });

    it('checks test is false runs resolves whenFalse ',(done)=>{
        promif.when({
            name: '',
            test: false,
            whenTrue: ()=>Promise.resolve(0),
            whenFalse: ()=>Promise.resolve(1)
        }).then((res)=>{
            expect(res).toBe(1);
            done();
        });
    });

    it('checks whenTrue gets initialization value',(done)=>{
        promif.when({
            name: '',
            test: true,
            whenTrue: (val)=>Promise.resolve(val),
            whenFalse: ()=>Promise.resolve(1)
        }, 'this is the initial value')
            .then((res)=>{
            expect(res).toBe('this is the initial value');
            done();
        });
    });

    it('checks whenFalse gets initialization value',(done)=>{
        promif.when({
            name: '',
            test: false,
            whenTrue: ()=>Promise.resolve(),
            whenFalse: (val)=>Promise.resolve(val)
        }, 'this is the initial value')
            .then((res)=>{
            expect(res).toBe('this is the initial value');
            done();
        });
    });

    it('checks test can be a promise (true)',(done)=>{
        promif.when({
            name: '',
            test: ()=>{return new Promise(resolve=>{setTimeout(()=>resolve(true),50)})},
            whenTrue: ()=>Promise.resolve(true),
            whenFalse: ()=>Promise.reject('shit')
        })
            .then((res)=>{
            expect(res).toBe(true);
            done();
        });
    });

    it('checks test can be a promise (false)',(done)=>{
        promif.when({
            name: '',
            test: ()=>{return new Promise(resolve=>{setTimeout(()=>resolve(false),50)})},
            whenTrue: ()=>Promise.resolve(true),
            whenFalse: ()=>Promise.reject('shit')
        })
            .then((res)=>{
            expect(res).toBe(true);
            done();
        }).catch(done);
    });

    it('checks catch when rejection',(done)=>{
        promif.when({
            name: '',
            test: ()=>{return new Promise(resolve=>{setTimeout(()=>resolve(false),50)})},
            whenTrue: ()=>Promise.resolve(true),
            whenFalse: ()=>Promise.reject('shit')
        })
            .then((res)=>{
            expect(res).toBe(true);
            done();
        }).catch((e)=>{
            expect(e).toBe('shit')
            done();
        });
    });

    it('checks resolves when called without params',(done)=>{
        promif.when()
            .then((res)=>{
                done.fail('shit'+res);
        }).catch((e)=>{
            expect(e.message.indexOf('WhenFalse was triggered')>-1).toBe(true);
            done();
        });
    });

});