const data = require("./config");
const utility = require('role.utility');

const harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!creep.memory.work.id)
            utility.getPriorityJob(creep)

        const workName = creep.memory.work.name
        const target = Game.getObjectById(creep.memory.work.id)
        
        if(workName)
            this[workName](creep, target)
    },

    energyHarvest: function(creep, target) {
        if(creep.memory.status == 'harvesting') {
            const harvestResult = creep.harvest(target);

            if(harvestResult == OK) {
                creep.say('⛏️');
            }
            else if(harvestResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, { reusePath: data.roles.harvester.reusePath });
            }
            else if(harvestResult == ERR_INVALID_TARGET || !target) {
                utility.clearWork(creep);
            }
            else if(utility.isStoreFull(creep)) {
                creep.memory.status = 'unloading';
            }
        }
        else if (creep.memory.status == 'unloading') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-empty');

            if(creep.transfer(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, { reusePath: data.roles.harvester.reusePath });
            }

            if(utility.isStoreEmpty(creep)) {
                creep.memory.status = 'harvesting';
            }
        }
        else {
            creep.memory.status = 'harvesting'
        }
    }
};

module.exports = harvester;
