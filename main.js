const creepFactory = require('creep.factory');
const utility = require('role.utility');
const rebalanceSystem = require('./rebalanceSystem');

const harvester = require('harvester');
const upgrader = require('upgrader');
const builder = require('builder');
const fixer = require('./fixer');
const buildingsFactory = require('buildings.factory');

module.exports.loop = function () {
    creepFactory.run('s-1');
    rebalanceSystem.run();
    

    for (const name in Game.creeps) {
        const creep = Game.creeps[name];

        randomMessage(creep)

        buildingsFactory.roadCheck(creep);
        utility.renewCreep(creep);

        if(!creep.memory.needsRenewing) {
            harvester.run(creep);
            upgrader.run(creep);
            builder.run(creep);
            fixer.run(creep);
        }
    }
}

function randomMessage(creep) {
    const value = getRandomInt(1, 1000);
    if(value > 0 && value <= 1)
        creep.say("Davv chuj!", true);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }