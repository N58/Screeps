const data = require("./config");
const utility = require('role.utility');

const fixer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.work.id)
            utility.getPriorityJob(creep)

        const workName = creep.memory.work.name
        const target = Game.getObjectById(creep.memory.work.id)
        
        if(workName)
            this[workName](creep, target)
    },

    // JOBS
    dropPick: function(creep, target) {
        
        if (creep.memory.status == 'unloading') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-empty');
            const transferResult = creep.transfer(energyStorage, RESOURCE_ENERGY);

            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, { reusePath: data.roles.fixer.reusePath });
            }
            else if(!target) {
                utility.clearWork(creep)
            }
            
            if(utility.isStoreEmpty(creep)) {
                creep.memory.status = 'picking'
            }
        }
        else if (creep.memory.status == 'picking') {
            const pickupResult = creep.pickup(target)
            
            if (pickupResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: data.roles.fixer.reusePath });
            }
            else if (pickupResult == ERR_INVALID_TARGET || utility.isStoreFull(creep)) {
                creep.memory.status = 'unloading'
            }
        }
        else {
            creep.memory.status = 'picking'
        }
    },

    towerReload: function(creep, target) {
        if (creep.memory.status == 'picking') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

            if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, { reusePath: data.roles.fixer.reusePath });
            }

            if(utility.isStoreFull(creep)) {
                creep.memory.status = 'unloading'
            }
        }
        else if (creep.memory.status == 'unloading') {
            const transferResult = creep.transfer(target, RESOURCE_ENERGY);

            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { reusePath: data.roles.fixer.reusePath });
            }
            else if (transferResult == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.status = 'picking'
            }
            else if (transferResult == ERR_INVALID_TARGET || transferResult == ERR_FULL) {
                utility.clearWork(creep)
            }
        }
        else {
            creep.memory.status = 'picking'
        }
    },
};

module.exports = fixer;