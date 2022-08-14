const gamedata = require('../models/gamedata')


const personEventEmitter = gamedata.watch()



//its's callback accepts change parameter which show details of the change in mongodb specific model in our case :-gamedata but i have omitted change parameter as lack of need

module.exports = function (io){
    let onlinePlayers = [];
    io.on('connection',  (socket)=>{
        personEventEmitter.on('change', async() => {
         try{
            onlinePlayers = await gamedata.find({'users.1':{'$exists':false}},{'roomId':1,'users':1,'_id':-1})
        .populate('users','username');

        socket.emit('updatedOnlinePlayers',onlinePlayers);
         }catch(err){
            console.log(err)
         }
    })
        
    })
}
