const data = require("./config");

const rebalanceSystem = {

    run: function(isForced) { 
        if((Game.time % data.config.rebalanceRate == 0) || isForced)
        {
            console.log('Rebalancing!');

            let sources = [];
            for (const roomName in Game.rooms) {
                const room = Game.rooms[roomName];

                sources.push(...room.find(FIND_SOURCES));
            }

            const sourceAmount = sources.length;

            let counter = 0;
            for (const name in Game.creeps) {
                const creep = Game.creeps[name];

                if(creep.memory.role == 'harvester') {
                    const sourceId = counter%sourceAmount;
                    const source = sources[sourceId];
                    creep.memory.work.id = source.id;

                    counter++;
                }
            }
        }
    }
};

module.exports = rebalanceSystem;