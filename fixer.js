const data = require("./config");
const utility = require('role.utility');

const fixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'fixer' && data.roles.fixer.enableWorking) {
            const droppedTarget = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            const brokenTarget = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });

            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                const energyStorage = utility.getClosestEnergyStorage(creep, 'half-empty');

                if(creep.transfer(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyStorage, { reusePath: data.roles.fixer.reusePath });
                }
            }
            else {
                
                if(droppedTarget) {
                    if(creep.pickup(droppedTarget) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(droppedTarget, { reusePath: data.roles.fixer.reusePath });
                    }
                }
            }
        }
    }
};

module.exports = fixer;