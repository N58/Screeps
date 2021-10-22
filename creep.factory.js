const data = require("config");
const rebalanceSystem = require("./rebalanceSystem");

const creepFactory = {

    run: function(spawn) { 
        
        for (const roleName in data.roles) {
            const role = data.roles[roleName];

            if(!role.enableSpawning)
                continue;

            const maxCount = role.count;
            const parts = role.parts;

            let count = 0;
            for (const name in Game.creeps) {
                const creep = Game.creeps[name];
                if(creep.memory.role == roleName)
                    count++;
            }

            if(count < maxCount)
            {
                let creepName = `${roleName}-${Game.time}`

                let spawnCreepResult = Game.spawns[spawn].spawnCreep(parts, creepName, {
                    memory: {
                        role: roleName,
                        needsRenewing: false,
                        renewing: false,
                        work: ''
                    }
                });

                if(spawnCreepResult == OK) {
                    
                    const creep = Game.creeps[creepName];
                    
                    if(typeof role.setAdditionalMemory === "function")
                        role.setAdditionalMemory(creep);

                    console.log(`Spawning new ${roleName}! Count: ${count} + 1.`)
                    
                    if(role.forceRebalance)
                        rebalanceSystem.run(true);

                    break;
                }
            }
            else if(count > maxCount)
            {
                let minimum = null;

                for (const name in Game.creeps) { 
                    const creep = Game.creeps[name];

                    if(creep.memory.role == roleName) {
                        if(minimum == null)
                            minimum = creep;

                        if(creep.store[RESOURCE_ENERGY] < minimum.store[RESOURCE_ENERGY])
                            minimum = creep;
                    }
                }

                console.log(`Deleting ${minimum.name}!`);

                minimum.suicide();                
            }
        }        
    }
};

module.exports = creepFactory;