import React from 'react'
import useSWR from 'swr';
import axios from 'axios';
import dispatch from './dispatch';
import {tryData} from './utils';

let expo = {
    create({axios, swr, ...other}){
        return Object.keys(expo).reduce((obj, e)=>{
            if((typeof expo[e]) == 'function'){
                obj[e] = expo[e].bind({axios, swr, ...other});
            }
            return obj;
        }, {})
    },
    fetch(method='', url, model, body, key, config={}, isSwr=false, defineProperty=true){
        if(typeof method != 'string'){
            url = method.url;
            model = method.model;
            body = method.body;
            key = method.key;
            config = method.config;
            method = method.method;
        }
        this?.onStart?.({
            method,
            url,
            model,
            body,
            key,
            config,
            isSwr
        });
        let ret = new Promise((resolve, reject) => {
            axios({
                url,
                method,
                data:body,
                ...this?.axios,
                ...config?.axios,
                params:{...this?.axios?.params, ...config?.params}
            }).then(result=>{

                result.config = {...result.config, ...config};
               
                let _dispatch = {};
                if(model && this?.store){
                    let _models = (model||'').split(',').map(e => e.trim());
                    let _key = (key||'').split(',').map(e => e.trim());

                    _dispatch = _models.reduce((obj, e, i)=>{
                        
                        let _method = (e||'').split('-')[0];
                        let model = (e||'').split('-')[1];

                        if(!model){
                            model = _method;
                            _method = method;
                        }
                        
                        obj[model] = dispatch({
                            method:_method, 
                            key:_key[i], 
                            model, 
                            data:tryData(result.data, model), 
                            store:this?.store
                        });
                        return obj;
                    }, {});
                }

                if(!isSwr){
                    this?.onSuccess?.({
                        ...result, 
                        model, 
                        key, 
                        dispatch:_dispatch,
                        isSwr
                    });
                }
                
                resolve({
                    ...result, 
                    model, 
                    key,
                    dispatch:_dispatch,
                    isSwr
                });
            }).catch((error) => {

                let ret = {
                    method,
                    url,
                    model,
                    body,
                    key,
                    config,
                    isSwr,
                    error
                }
                this?.onError?.(ret);
                reject(ret);
            });
        });

        if(defineProperty){
            
            Object.defineProperty(ret, 'config', {
                value: function(config){
                    return expo.fetch.call(this, method, url, model, body, key, config, isSwr, false);
                }.bind(this)
            });
        }

        return ret;
    },
    $fetch(method='', target, model, body, key, config={}, defineProperty=true){
        if(typeof method != 'string'){
            target = method.url;
            model = method.model;
            body = method.body;
            key = method.key;
            config = method.config;
            method = method.method;
        }
        let {data, error, isValidating, mutate} = useSWR([target, this?.token], url => expo.fetch.call(this, method, url, model, body, key, config, true, false), {
            /* revalidateOnReconnect:true,
            shouldRetryOnError:true,
            errorRetryCount:10, */
            ...this?.swr,
            ...config?.swr
        });

        this?.$onSuccess?.(data);
        
        let ret = {data, error, isValidating, mutate};
        if(defineProperty){
            Object.defineProperty(ret, 'config', {
                value: function(config){
                    return expo.$fetch.call(this, method, target, model, body, key, config, true);
                }.bind(this)
            });
        }
        return ret;
    },
    get(target, model, config={}){
        return expo.fetch.call(this, 'get', target, model, null, null, config)
    },
    post(target, model, body, config={}){
        return expo.fetch.call(this, 'post', target, model, body, null, config)
    },
    put(target, model, body, key, config={}){
        return expo.fetch.call(this, 'put', target, model, body, key, config)
    },
    remove(target, model, key, config={}){
        return expo.fetch.call(this, 'delete', target, model, null, key, config)
    },

    $get(target, model, config={}){
        return expo.$fetch.call(this, 'get', target, model, null, null, config)
    },
    $post(target, model, body, config={}){
        return expo.$fetch.call(this, 'post', target, model, body, null, config)
    },
    $put(target, model, body, key, config={}){
        return expo.$fetch.call(this, 'put', target, model, body, key, config)
    },
    $delete(target, model, key, config={}){
        return expo.$fetch.call(this, 'delete', target, model, null, key, config)
    }
}
export let create = expo.create;
export let fetch = expo.fetch;
export let $fetch = expo.$fetch;
export let get = expo.get;
export let post = expo.post;
export let put = expo.put;
export let remove = expo.remove;
export let $get = expo.$get;
export let $post = expo.$post;
export let $put = expo.$put;
export let $delete = expo.$delete;
export default expo;