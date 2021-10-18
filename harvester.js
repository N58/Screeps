const data = require("./config");
const utility = require('role.utility');

const harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'harvester' && data.roles.harvester.enableWorking) {
            if(!creep.memory.unloading) {
                if(creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.unloading = true;
                }
                else {
                    let source = Game.getObjectById(creep.memory.sourceId);
                    const harvesting = creep.harvest(source);

                    if(harvesting == OK) {
                        creep.say('⛏️');
                    }
                    else if(harvesting == ERR_NOT_IN_RANGE) {
                        creep.moveTo(source, { reusePath: data.roles.harvester.reusePath });
                    }
                }
            }
            else {
                if(creep.store.getUsedCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.unloading = false;
                }
                else {
                    const energyStorage = utility.getClosestEnergyStorage(creep, 'half-empty');

                    if(creep.transfer(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(energyStorage, { reusePath: data.roles.harvester.reusePath });
                    }
                }
            }
        }
    }
};

module.exports = harvester;