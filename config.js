const data = {
    config: {
        enableRenewing: true,
        rebalanceRate: 10000, // every X tick do rebalance
        defaultHarvestingRooms: ['W5N8'], // 'W6N8'
    },
    roles: {
        harvester: {
            enableWorking: true,
            enableSpawning: true,
            count: 10,
            reusePath: 10,
            parts: [WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE],
            forceRebalance: true,
            setAdditionalMemory: function(creep) {
                creep.memory.unloading = false;
            }
        },
        fixer: {
            enableWorking: true,
            enableSpawning: true,
            count: 1,
            reusePath: 10,
            parts: [WORK, CARRY, CARRY, MOVE],
        },
        builder: {
            enableWorking: true,
            enableSpawning: true,
            count: 4,
            reusePath: 10,
            parts: [WORK, WORK, CARRY, MOVE],
        },
        upgrader: {
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
    resources: {
        energy: {
            rooms: ['default'],
            harvestersCount: 10
        }
    }
}

module.exports = data;