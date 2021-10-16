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
                    if(Game.spawns['s-1'].store[RESOURCE_ENERGY] < creepCapacity) {
                        utility.moveOut(creep);
                    }
                    else if(creep.withdraw(Game.spawns['s-1'], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns['s-1']);
                    }
                }
                else {
                    const building = creep.build(target)
                    if(building == OK)
                        creep.say('🏗️');
                    else if(building == ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                }
            }
            else {
                utility.moveOut(creep);
            }
        }
    }
};

module.exports = builder;