const data = {
    config: {
        enableRenewing: true,
        rebalanceRate: 10000, // every X tick do rebalance
        defaultHarvestingRooms: ['W5N8'], // 'W6N8'
        pathFindingOpts: function(creep) {
            return {
                reusePath: 10,
                plainCost: 2,
                swampCost: 10
            }
        },
    },
    roles: {
        harvester: {
            enableWorking: true,
            enableSpawning: true,
            count: 8,
            parts: [WORK, CARRY, CARRY, MOVE],
            jobs: [ 'energyHarvest' ],
            setAdditionalMemory: function(creep) {
                creep.memory.status = 'harvesting';
            }
        },
        fixer: {
            enableWorking: true,
            enableSpawning: true,
            count: 2,
            parts: [WORK, CARRY, CARRY, MOVE],
            jobs: [ 'towerReload', 'dropPick' ],
            setAdditionalMemory: function(creep) {
                creep.memory.status = 'picking';
            }
        },
        builder: {
            enableWorking: true,
            enableSpawning: true,
            count: 2,
            parts: [WORK, WORK, CARRY, MOVE],
            jobs: [ 'structureBuild' ],
        },
        upgrader: {
            enableWorking: true,
            enableSpawning: true,
            count: 10,
            parts: [WORK, CARRY, CARRY, MOVE],
            jobs: [ 'controllerUpgrade' ],
            setAdditionalMemory: function(creep) {
                creep.memory.status = 'picking';
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
            isAvailable: function() {
                let sources = []

                for (const name in Game.rooms) {
                    const room = Game.rooms[name]

                    sources.push(...room.find(FIND_SOURCES))
                }

                let sums = {}

                for (const source of sources) {
                    sums[source.id] = 0;
                }

                for (const name in Game.creeps) {
                    const tempCreep = Game.creeps[name]
                    const obj = Game.getObjectById(tempCreep.memory.work.id)

                    if(obj && obj.ticksToRegeneration != undefined && obj.energy != undefined) {
                        sums[obj.id]++;
                    }
                }

                const minKey = Object.keys(sums).reduce((key, v) => sums[v] < sums[key] ? v : key);
                const minSource = Game.getObjectById(minKey);
                return minSource;
            }
        },
        structureBuild: {
            isAvailable: function(creep) {
                return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            }
        },
        controllerUpgrade: {
            isAvailable: function(creep) {
                return {id: true}
            }
        }
    }
}

module.exports = data;