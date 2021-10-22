const data = require("./config");
const utility = require('role.utility');

const fixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'fixer' && data.roles.fixer.enableWorking) {
            const target = utility.getPriorityJob(creep);
            const workName = creep.memory.work;

            if(workName)
                this[workName](creep, target);
        }
    },

    // JOBS
    dropPick: function(creep, target) {
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) <= 0) {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-empty');

            if(creep.transfer(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, { reusePath: data.roles.fixer.reusePath });
            }
        }
        else if(target)  {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: data.roles.fixer.reusePath });
            }
        }
    },

    towerReload: function(creep, target) {
        if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

            if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, { reusePath: data.roles.fixer.reusePath });
            }
        }
        else if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: data.roles.fixer.reusePath });
            }
        }
    },

    structureFix: function(creep, target) {
        
    }
};

module.exports = fixer;