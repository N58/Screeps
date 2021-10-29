const data = require("./config");
const utility = require('role.utility');
const reusePath = data.config.reusePath

const jobs = { 
    energyHarvest: function(creep, target) {
        if(creep.memory.status == 'harvesting') {
            const harvestResult = creep.harvest(target);

            if(harvestResult == OK) {
                creep.say('⛏️');
            }
            else if(harvestResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, data.config.pathFindingOpts(creep));
            }
            else if(harvestResult == ERR_INVALID_TARGET || !target) {
                creep.clearWork()
            }

            if(creep.isStoreFull()) {
                creep.memory.status = 'unloading';
            }
        }
        else if (creep.memory.status == 'unloading') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'not-full');

            if(creep.transfer(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, data.config.pathFindingOpts(creep));
            }

            if(creep.isStoreEmpty()) {
                creep.memory.status = 'harvesting';
            }
        }
        else {
            creep.memory.status = 'harvesting'
        }
    },

    dropPick: function(creep, target) {
        
        if (creep.memory.status == 'unloading') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'not-full');
            const transferResult = creep.transfer(energyStorage, RESOURCE_ENERGY);

            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, data.config.pathFindingOpts(creep));
            }
            
            if(creep.isStoreEmpty()) {
                creep.memory.status = 'picking'
            }
        }
        else if (creep.memory.status == 'picking') {
            const pickupResult = creep.pickup(target)
            
            if (pickupResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, data.config.pathFindingOpts(creep));
            }
            else if (pickupResult == ERR_INVALID_TARGET) {
                creep.clearWork()
            }
            
            if(creep.isStoreFull()) {
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
                creep.moveTo(energyStorage, data.config.pathFindingOpts(creep));
            }

            if(creep.isStoreFull()) {
                creep.memory.status = 'unloading'
            }
        }
        else if (creep.memory.status == 'unloading') {
            const transferResult = creep.transfer(target, RESOURCE_ENERGY);

            if(transferResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, data.config.pathFindingOpts(creep));
            }
            else if (transferResult == ERR_NOT_ENOUGH_RESOURCES) {
                creep.memory.status = 'picking'
            }
            else if (transferResult == ERR_INVALID_TARGET || transferResult == ERR_FULL) {
                creep.clearWork()
            }
        }
        else {
            creep.memory.status = 'picking'
        }
    },

    structureBuild: function(creep, target) {
        if(creep.isStoreEmpty()) {
            if(!target) {
                creep.clearWork()
                return
            }

            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

            if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) 
                creep.moveTo(energyStorage, data.config.pathFindingOpts(creep));
        }
        else {
            const building = creep.build(target)
            if (building == OK)
                creep.say('🏗️');
            else if (building == ERR_NOT_IN_RANGE)
                creep.moveTo(target, data.config.pathFindingOpts(creep));
            else if (building == ERR_INVALID_TARGET)
                creep.clearWork()
        }
    },

    controllerUpgrade: function(creep) {
        if(creep.memory.status == 'picking') {
            const energyStorage = utility.getClosestEnergyStorage(creep, 'half-full');

            if(creep.withdraw(energyStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(energyStorage, data.config.pathFindingOpts(creep));
            }

            if(creep.isStoreFull()) {
                creep.memory.status = 'upgrading';
            }
        }
        else if(creep.memory.status = 'upgrading') {
            const upgradingResult = creep.upgradeController(creep.room.controller);

            if(upgradingResult == OK) {
                creep.say('🆙');
            }
            else if(upgradingResult == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, data.config.pathFindingOpts(creep));
            }

            if(creep.isStoreEmpty())
                creep.memory.status = 'picking';
        }
        else {
            creep.memory.status = 'picking';
        }
    },
};

module.exports = jobs;