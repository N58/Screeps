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
            count: 7,
            parts: [WORK, CARRY, CARRY, MOVE, MOVE ],
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
            count: 4,
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
                const structures = roomData[creep.room.name].TOWERS

                return creep.pos.findClosestByPath(structures, {
                    filter: (structure) => {
                        return structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
                    }
                });
            }
        },
        dropPick: {
            isAvailable: function(creep) {
                const structures = roomData[creep.room.name].FIND_DROPPED_RESOURCES.filter(rs => rs.resourceType == RESOURCE_ENERGY)

                return creep.pos.findClosestByPath(structures);
            }
        },
        structureFix: {
            isAvailable: function(creep) {
                const structures = roomData[creep.room.name].STRUCTURES_TO_REPAIR

                return creep.pos.findClosestByPath(structures);
            }
        },
        energyHarvest: {
            isAvailable: function() {
                let sources = []

                for (const name in Game.rooms) {
                    sources.push(...roomData[name].FIND_SOURCES)
                }

                let sums = {}

                for (const source of sources) {
                    sums[source.id] = 0;
                }

                for (const name in Game.creeps) {
                    const tempCreep = Game.creeps[name]
                    const work = tempCreep.getWork()
                    const obj = Game.getObjectById(work.id)

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
                const structures = roomData[creep.room.name].FIND_CONSTRUCTION_SITES

                return creep.pos.findClosestByPath(structures);
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