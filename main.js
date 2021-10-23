const creepFactory = require('creep.factory');
const utility = require('role.utility');
const rebalanceSystem = require('./rebalanceSystem');
const data = require('./config');

const buildingsFactory = require('buildings.factory');
const tower = require('./tower');

let files = {}

for (const name in data.roles) {
    const role = data.roles[name];
    
    files[name] = role.file();
}

module.exports.loop = function () {
    creepFactory.run('s-1');
    //rebalanceSystem.run();
    tower.run();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        buildingsFactory.roadCheck(creep);

        if (Game.time % 5 == 0)
            utility.renewCreep(creep);

        const dataRoles = data.roles;
        const creepMemory = creep.memory;
        if(!creepMemory.needsRenewing) { 
            const roleConfig = dataRoles[creepMemory.role];

            if(roleConfig.enableWorking) {
                files[creepMemory.role].run(creep);
            }
        }
    }
}
