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
    fetch(method='', url, model, body, key, config={}){
        this?.onStart?.({
            method,
            url,
            model,
            body,
            key,
            config
        });
        return new Promise((resolve, reject) => {
            axios({
                url,
                method,
                data:body,
                ...this?.axios,
                ...config?.axios,
                params:{...this?.axios?.params, ...config?.params}
            }).then(result=>{
               
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

                this?.onSuccess?.({
                    ...result, 
                    model, 
                    key, 
                    dispatch:_dispatch
                });

                resolve({
                    ...result, 
                    model, 
                    key,
                    dispatch:_dispatch
                });
            }).catch((error) => {
    
                this?.onError?.(error);
                reject(error);
            });
        });
    },
    $fetch(method='', target, model, body, key, config={}){
        let {data, error, isValidating, mutate} = useSWR([target, this?.token], url => expo.fetch.call(this, method, url, model, body, key, config), {
            /* revalidateOnReconnect:true,
            shouldRetryOnError:true,
            errorRetryCount:10, */
            ...this?.swr,
            ...config?.swr
        });

        this?.$onSuccess?.(data);
        
        return {data, error, isValidating, mutate};
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