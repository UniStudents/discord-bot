const glob = require('glob')
const path = require('path')
module.exports ={
    searchFiles: async (pathWithPattern) =>{
        return new Promise((resolve,reject) => {
            glob(path.resolve(__dirname,`${pathWithPattern}`),null,(err,result) => {
                if(err){
                    reject(err)
                }else{
                    resolve(result)
                }
            })
        })
    }
}