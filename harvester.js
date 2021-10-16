const data = require("./config");

const harvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.memory.role == 'harvester' && data.roles.harvester.enableWorking) {
            if(creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                let source = Game.getObjectById(creep.memory.sourceId);
                const harvesting = creep.harvest(source);

                if(harvesting == OK) {
                    creep.say('⛏️');
                }
                else if(harvesting == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
            else {
                const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN || 
                            structure.structureType == STRUCTURE_EXTENSION) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    }
                });
                //console.log(target)

                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            
        }
    }
};

module.exports = harvester;