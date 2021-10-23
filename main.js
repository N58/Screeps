const creepFactory = require('creep.factory');
const utility = require('role.utility');
const data = require('./config');

const buildingsFactory = require('buildings.factory');
const tower = require('./tower');
const jobs = require('jobs');

const recordsNumber = 100

module.exports.loop = function () {
    // Record CPU
    const startCpu = Game.cpu.getUsed()

    // Work
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
                if (!creep.memory.work.id)
                    utility.getPriorityJob(creep)

                const workName = creep.memory.work.name
                const target = Game.getObjectById(creep.memory.work.id)
                
                if(workName)
                    jobs[workName](creep, target)
            }
        }
    }
    
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
