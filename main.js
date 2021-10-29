const creepFactory = require('creep.factory');
const buildingsFactory = require('buildings.factory');
const data = require('./config');
const jobs = require('jobs');
const utility = require('role.utility');
const tower = require('./tower');
require('./prototypeExtensions');

const recordsNumber = 100

const profiler = require('screeps-profiler');

profiler.enable();

module.exports.loop = function () {
    // Record CPU
    const startCpu = Game.cpu.getUsed()
    
    profiler.wrap(function() {
        // Work
        roomData = {}
        for (const name in Game.rooms) {
            const room = Game.rooms[name];
            const structures = room.find(FIND_STRUCTURES);

            roomData[name] = {
                STRUCTURES: structures,
                EXTENSIONS: structures.filter(s => s.structureType == STRUCTURE_EXTENSION),
                TOWERS: structures.filter(s => s.structureType == STRUCTURE_TOWER),
                DEFENSIVE_STRUCTURES: structures.filter(s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART),
                STRUCTURES_TO_REPAIR: structures.filter(s => (s.hits != s.hitsMax)),
                FIND_SOURCES: room.find(FIND_SOURCES),
                FIND_DROPPED_RESOURCES: room.find(FIND_DROPPED_RESOURCES),
                FIND_CONSTRUCTION_SITES: room.find(FIND_CONSTRUCTION_SITES),
                FIND_CREEPS: room.find(FIND_CREEPS),
            }
        }

        creepFactory.run('s-1');
        tower.run();

        for (const name in Game.creeps) {
            const creep = Game.creeps[name];

            buildingsFactory.roadCheck(creep);

            utility.renewCreep(creep);

            const dataRoles = data.roles;
            const creepMemory = creep.memory;
            if(!creepMemory.needsRenewing) { 
                const roleConfig = dataRoles[creepMemory.role];

                if(roleConfig.enableWorking) {
                    const work = creep.getWork()
                    if (!work.id)
                        utility.getPriorityJob(creep)

                    const workName = work.name
                    const target = Game.getObjectById(work.id)
                    
                    if(workName)
                        jobs[workName](creep, target)
                }
            }
        }
    });
    
    // Finish recording CPU
    const differenceCpu = Math.round((Game.cpu.getUsed() - startCpu) * 10) / 10;

    if(Memory.lastCpuRecords == undefined)
        Memory.lastCpuRecords = []
    
    Memory.lastCpuRecords.push(differenceCpu)

    if(Memory.lastCpuRecords.length >= recordsNumber) {
        for (let i = 0; i < Memory.lastCpuRecords.length - recordsNumber; i++) 
        Memory.lastCpuRecords.shift();
    }
    
    if(Game.time % recordsNumber == 0) {
        const sum = Memory.lastCpuRecords.reduce((a, b) => a + b, 0)
        const avg = Math.round(((sum / Memory.lastCpuRecords.length) || 0) * 10) / 10;

        /*
        console.log(Memory.lastCpuRecords)
        console.log(Memory.lastCpuRecords.length)
        console.log(sum)
        console.log(avg)
        */

        console.log(`Average CPU usage in last ${recordsNumber} ticks is ${avg}. There are ${Object.keys(Game.creeps).length} creeps.`)
    }
}
