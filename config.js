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
            parts: [WORK, CARRY, CARRY, MOVE],
            forceRebalance: true
        },
        builder: {
            enableWorking: true,
            enableSpawning: true,
            count: 5,
            parts: [WORK, WORK, CARRY, MOVE],
        },
        upgrader: {
            enableWorking: true,
            enableSpawning: true,
            count: 6,
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