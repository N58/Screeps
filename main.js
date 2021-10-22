const creepFactory = require('creep.factory');
const utility = require('role.utility');
const rebalanceSystem = require('./rebalanceSystem');

harvester = require('harvester');
upgrader = require('upgrader');
builder = require('builder');
fixer = require('fixer');

const buildingsFactory = require('buildings.factory');
const tower = require('./tower');

module.exports.loop = function () {
    creepFactory.run('s-1');
    rebalanceSystem.run();
    tower.run();

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        buildingsFactory.roadCheck(creep);

        if (Game.time % 5 == 0)
            utility.renewCreep(creep);

        const roles = data.roles;
        const creepRole = creep.memory.role;
        if(!creep.memory.needsRenewing) { 
            if(roles[creepRole].enableWorking) {
                this[creepRole].run(creep);
            }
        }
    }
}
