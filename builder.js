const data = require("./config");
const utility = require('role.utility');

const builder = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'builder' && data.roles.builder.enableWorking) {
            const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            const creepCapacity = creep.store.getCapacity(RESOURCE_ENERGY);

            if(target) {
                if(creep.store[RESOURCE_ENERGY] <= 0) {
                    const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

                    if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energyStorage, { reusePath: data.roles.builder.reusePath });
                    }
                    
                }
                else {
                    const building = creep.build(target)
                    if(building == OK)
                        creep.say('🏗️');
                    else if(building == ERR_NOT_IN_RANGE)
                        creep.moveTo(target, { reusePath: data.roles.builder.reusePath });


                    /*
                    else if(Game.spawns['s-1'].store[RESOURCE_ENERGY] < creepCapacity) {
                        utility.moveOut(creep);
                    }
                    */
                }
            }
            else {
                utility.moveOut(creep);
            }
        }
    }
};

module.exports = builder;