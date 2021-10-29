const data = require("./config");

let all = {
    renewCreep: function(creep) {
        const goal = { pos: Game.spawns['s-1'].pos }
        
        if(data.config.enableRenewing) {
            if(!creep.memory.needsRenewing) {
                const cost = this.calcTickCost(creep, creep.pos, goal)
                if(creep.ticksToLive <= cost) {
                    creep.memory.needsRenewing = true;
                }
                else {
                    creep.memory.needsRenewing = false;
                }
            }
    
            if(creep.memory.needsRenewing) {
                const renewTry = renew('s-1', creep);
    
                if(renewTry == OK) {
                    creep.memory.renewing = true;
                }
                else if(renewTry == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['s-1']);
                    creep.say('🔋🔻');
                    return;
                }
            }
    
            if(creep.memory.renewing && creep.memory.needsRenewing)
            {
                const renewTry = renew('s-1', creep);
                if(renewTry == ERR_FULL) {
                    creep.memory.renewing = false;
                    creep.memory.needsRenewing = false;
                    creep.say('🔋✔️');
                }
            }
        }
    },

    calcTickCost: function(creep, origin, goal) {
        const additionalPercentage = 0.1; // 0.1 = 10%
        
        const foundPath = PathFinder.search(origin, goal, {
            plainCost: 2,
            swampCost: 10
        });

        let ticks = (foundPath.cost * this.getOtherPartsCount(creep) ) / this.getMovePartsCount(creep)
        ticks = ticks + Math.ceil(ticks * additionalPercentage);

        return ticks;
    },

    // NOT USED YET
    calculateCostMatrix: function(room) {
        let costMatrix = new PathFinder.CostMatrix;

        roomData[room.name].FIND_STRUCTURES.forEach(struct => {
            if(struct.structureType == STRUCTURE_ROAD)
                costMatrix.set(struct.pos.x, struct.pos.y, 1);
            else if (struct.structureType !== STRUCTURE_CONTAINER &&
                    (struct.structureType !== STRUCTURE_RAMPART ||
                    !struct.my))
                costMatrix.set(struct.pos.x, struct.pos.y, 255);
        });

        roomData[room.name].FIND_CREEPS.forEach(creep => {
            costMatrix.set(creep.pos.x, creep.pos.y, 255);
        });

        return costMatrix
    },

    getMovePartsCount: function(creep) {
        return creep.getActiveBodyparts(MOVE);
    },

    getOtherPartsCount: function(creep) {
        const work = creep.getActiveBodyparts(WORK);
        const carry = creep.getActiveBodyparts(CARRY);
        const attack = creep.getActiveBodyparts(ATTACK);
        const ranged = creep.getActiveBodyparts(RANGED_ATTACK);
        const heal = creep.getActiveBodyparts(HEAL);
        const tough = creep.getActiveBodyparts(TOUGH);

        return work + carry + attack + ranged + heal + tough;
    },

    getPlainCost: function(creep) {
        return 2 * this.getOtherPartsCount(creep)
    },

    getSwampCost: function(creep) {
        return 10 * this.getOtherPartsCount(creep)
    },

    getClosestEnergyStorage: function(creep, capacity) {
        if(capacity == null)
            capacity = 'full';

        return creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (structure) => {
                let capacityCondition = false;

                if((structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN))
                {
                    switch (capacity) {
                        case 'full':
                            capacityCondition = structure.store.getFreeCapacity(RESOURCE_ENERGY) <= 0
                            break;
                        case 'half-full':
                            capacityCondition = structure.store.getUsedCapacity(RESOURCE_ENERGY) >= (structure.store.getCapacity(RESOURCE_ENERGY) / 2);
                            break;
                        case 'half-empty':
                            capacityCondition = structure.store.getUsedCapacity(RESOURCE_ENERGY) <= (structure.store.getCapacity(RESOURCE_ENERGY) / 2);
                            break;
                        case 'empty':
                            capacityCondition = structure.store.getUsedCapacity(RESOURCE_ENERGY) <= 0
                            break;
                        case 'not-full':
                            capacityCondition = structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                            break;
                        case 'not-empty':
                            capacityCondition = structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                            break;
                    }
                }

                return capacityCondition;
            }
        });
    },

    getPriorityJob: function(creep) {
        const roleConfig = creep.getConfig()
        const jobsPriority = roleConfig.jobs

        for (const job of jobsPriority) {
            if (data.jobs[job]) {
                const target = data.jobs[job].isAvailable(creep)
                if(target) {
                    //console.log(`${creep.name} gets job: ${job}`)
                    creep.setWork(job, target.id)
                    return;
                }
            }
        }

        creep.clearWork()
    },
};

function renew(spawn, creep) {
    const renewTry = Game.spawns[spawn].renewCreep(creep);
    if(renewTry == OK)
        creep.say(`🔋⚡`);
    else
        creep.say('🔋🔻');
    return renewTry;
}

module.exports = all;