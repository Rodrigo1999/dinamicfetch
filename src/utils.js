let expo = {
    tryData(data, model){
        try{
            return data[model] || data;
        }catch(err){
            return data;
        }
    }
}

export let tryData = expo.tryData;
export default expo;