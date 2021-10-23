const data = {
    config: {
        enableRenewing: true,
        rebalanceRate: 10000, // every X tick do rebalance
        defaultHarvestingRooms: ['W5N8'], // 'W6N8'
    },
    roles: {
        harvester: {
            file: () => { return require('harvester') },
            enableWorking: true,
            enableSpawning: true,
            count: 10,
            reusePath: 10,
            parts: [WORK, CARRY, CARRY, MOVE],
            jobs: [ 'energyHarvest' ],
            forceRebalance: true,
            setAdditionalMemory: function(creep) {
                creep.memory.status = 'harvesting';
            }
        },
        fixer: {
            file: () => { return require('fixer') },
            enableWorking: true,
            enableSpawning: true,
            count: 1,
            reusePath: 10,
            parts: [WORK, CARRY, CARRY, MOVE],
            jobs: [ 'towerReload', 'dropPick' ],
            setAdditionalMemory: function(creep) {
                creep.memory.status = 'picking';
            }
        },
        builder: {
            file: () => { return require('builder') },
            enableWorking: true,
            enableSpawning: true,
            count: 4,
            reusePath: 10,
            parts: [WORK, WORK, CARRY, MOVE],
        },
        upgrader: {
            file: () => { return require('upgrader') },
            enableWorking: true,
            enableSpawning: true,
            count: 3,
            reusePath: 10,
            parts: [WORK, CARRY, CARRY, MOVE],
            setAdditionalMemory: function(creep) {
                creep.memory.upgrading = false;
            }
        },
    },
    jobs: {
        towerReload: {
            isAvailable: function(creep) {
                return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
            }
        },
        dropPick: {
            isAvailable: function(creep) {
                return creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES);
            }
        },
        structureFix: {
            isAvailable: function(creep) {
                return creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
            }
        },
        energyHarvest: {
            isAvailable: function(creep) {
                let sources = []

                for (const name in Game.rooms) {
                    const room = Game.rooms[name]

                    sources.push(...room.find(FIND_SOURCES))
                }

                let sums = {}

                for (const name in Game.creeps) {
                    const tempCreep = Game.creeps[name]
                    const obj = Game.getObjectById(tempCreep.memory.work.id)

                    if(obj.ticksToRegeneration != undefined && obj.energy != undefined) {
                        
                        sums[obj.id] = (sums[obj.id] ?? 0) + 1
                    }
                }

                const minKey = Object.keys(sums).reduce((key, v) => obj[v] < obj[key] ? v : key);
                const minSource = Game.getObjectById(minKey);
                return minSource;
            }
        }
    },
    resources: {
        energy: {
            rooms: ['default'],
            harvestersCount: 10
        }
    },
}

module.exports = data;