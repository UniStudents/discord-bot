module.exports={
    sendDmMessage: (user,message)=>{
        return new Promise((resolve, reject) => {
            let channel = user.dmChannel ? user.dmChannel : null
            if(!channel){
                user.createDM().then(dm => {
                    channel = dm
                    channel.send(message).catch(err => {
                        reject(err)
                    })
                    resolve(channel)
                })
            }else{
                channel.send(message).catch(err => {
                    reject(err)
                })
                resolve(channel)
            }
        })
    }
}