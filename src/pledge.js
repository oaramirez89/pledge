'use strict';
/*----------------------------------------------------------------
Promises Workshop: build the pledge.js ES6-style promise library
----------------------------------------------------------------*/
// YOUR CODE HERE:
function $Promise(executor) {
    if (typeof executor !== 'function') {
        throw new TypeError('executor var needs to be function');
    }

    this._state = 'pending';
    this._value = undefined;
    this._handlerGroups = [];

    var res = this._internalResolve.bind(this);
    var rej = this._internalReject.bind(this);
    executor(res, rej);

}

$Promise.prototype._internalResolve = function (data) {
    if (this._state === 'pending') {
        this._state = 'fulfilled';
        this._value = data;
        //if (this.data){
            this.then();
        //}
    }
}

$Promise.prototype._internalReject = function (err) {
    if (this._state === 'pending') {
        this._state = 'rejected';
        this._value = err;
        this.then();
    }
}

$Promise.prototype.then = function(sucCB, errCB){
    let handler = {};

    // if we get no handlers in this call, nothing to store
    // go directly to execute existing handlers.
    if (sucCB  || errCB){
        handler.successCb = (typeof sucCB === 'function') ? sucCB : null;
        handler.errorCb = (typeof errCB === 'function') ? errCB : null;

        let existingHandlers = this._handlerGroups.filter((element) => {
            return ((sucCB !== null && element.successCb === sucCB)
            || (errCB !== null && element.errorCb === errCB));
        });

        if(existingHandlers.length === 0){
            this._handlerGroups.push(handler);
        }
    }

    if (this._state === 'pending') return;

    if(this._state === 'fulfilled'){
        if (sucCB){
            return sucCB(this._value);
        } else {
            this._handlerGroups.forEach(function(handler){
                return handler.successCb(this._value);
            }, this)
        }
    }
    if(this._state === 'rejected'){
        if (errCB){
            return errCB(this._value);
        } else {
            this._handlerGroups.forEach(function(handler){
                if (handler.errorCb !== null){
                    return handler.errorCb(this._value);
                }
            }, this)
        }
    }
}

var log = [];
var theReason = { code: 'unauthorized' }
var logOops = function(){
    log.push({code: 'oops'});
}
var logInput = function(input){
    log.push(input);
}

var promise = new $Promise(function(){});
promise.then(null, logInput);
promise.then(null, logOops);
promise._internalResolve(theReason);


// promise.then(f1, f2);
// promise.then(f1, f2);

/*-------------------------------------------------------
The spec was designed to work with Test'Em, so we don't
actually use module.exports. But here it is for reference:

module.exports = $Promise;

So in a Node-based project we could write things like this:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
