const data = require("./config");
const utility = require('role.utility');

const upgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'upgrader' && data.roles.upgrader.enableWorking) {
            if(creep.store[RESOURCE_ENERGY] == 0) {
                creep.memory.upgrading = false;
            }
            else if(creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
                creep.memory.upgrading = true;
            }

            if(!creep.memory.upgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

                if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(energyStorage, { reusePath: data.roles.upgrader.reusePath });
                }
            }
            else if(creep.memory.upgrading) {
                const upgrading = creep.upgradeController(creep.room.controller);

                if(upgrading == OK) {
                    creep.say('🆙');
                }
                else if(upgrading == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, { reusePath: data.roles.upgrader.reusePath });
                }
            }
        }
    }
};

module.exports = upgrader;