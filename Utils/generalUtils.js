const {WebRiskServiceClient} = require('@google-cloud/web-risk');
const client = new WebRiskServiceClient();

module.exports = {
    chunk_inefficient_sorted: (chunkSize,sortElement,objectArray)=>{
      objectArray =  objectArray.sort((a,b)=> {
            let keyA = a[sortElement], keyB = b[sortElement];
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
        });
        objectArray = [].concat.apply([],
            objectArray.map(function(elem, i) {
                return i % chunkSize ? [] : [objectArray.slice(i, i + chunkSize)];
            })
        )
      return objectArray
    },

    chunk_inefficient:(chunkSize,objectArray)=>{
        objectArray = [].concat.apply([],
            objectArray.map(function(elem, i) {
                return i % chunkSize ? [] : [objectArray.slice(i, i + chunkSize)];
            })
        )
        return objectArray
    },
    isLinkSafe: async (link)=>{
        return new Promise(async (resolve,reject) => {
            console.log(link)
            const request = {
                uri: link,
                threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
            };

            // call the WebRisk searchUris API.
            const threat = await client.searchUris(request);
            if (threat) {
                resolve(threat)
            } else {
                resolve(null)
            }
        })
    }
}