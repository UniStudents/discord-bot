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
    }
}