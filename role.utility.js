const data = require("./config");

let all = {
    renewCreep: function(creep) {
        const goal = { pos: Game.spawns['s-1'].pos, range: 1 }
        
        if(data.config.enableRenewing) {
            if(!creep.memory.needsRenewing) {
                const cost = this.calcTickCost(creep, creep.pos, goal)
                if(creep.ticksToLive <= cost) {
                    creep.memory.needsRenewing = true;
                }
                else {
                    creep.memory.needsRenewing = false;
                }
            }
    
            if(creep.memory.needsRenewing) {
                const renewTry = renew('s-1', creep);
    
                if(renewTry == OK) {
                    creep.memory.renewing = true;
                }
                else if(renewTry == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns['s-1']);
                    creep.say('🔋🔻');
                    return;
                }
            }
    
            if(creep.memory.renewing && creep.memory.needsRenewing)
            {
                const renewTry = renew('s-1', creep);
                if(renewTry == ERR_FULL) {
                    creep.memory.renewing = false;
                    creep.memory.needsRenewing = false;
                    creep.say('🔋✔️');
                }
            }
        }
    },

    calcTickCost: function(creep, origin, goal) {
        const additionalPercentage = 0.1; // 0.1 = 10%

        let fatigueDecreaserCount = 0;
        let fatigueIncreaserCount = 0;
        let carryLoad = 0;
        let carryCount = 0;

        for (const part of creep.body) {
            const type = part.type
            
            if(type == 'move')
                fatigueDecreaserCount++;
            else if(type == 'carry')
            {
                for (const resource in creep.carry) {
                    const amount = creep.carry[resource];
                    carryLoad += amount;
                }

                carryCount++;
            }
            else
                fatigueIncreaserCount++;
        }

        if(carryLoad > 0)
            fatigueIncreaserCount += carryCount;
        
        const foundPath = PathFinder.search(origin, goal, {
            plainCost: 2 * fatigueIncreaserCount,
            swampCost: 10 * fatigueIncreaserCount
        });

        let ticks = foundPath.cost - (foundPath.path.length * fatigueDecreaserCount * 2)
        ticks = ticks + Math.ceil(ticks * additionalPercentage);

        return ticks;
    },

    moveOut: function(creep) {
        if(creep.pos.isNearTo(Game.spawns['s-1'])) {
            let success = creep.move(TOP);
            if(success != 0)
                success = creep.move(RIGHT);
            if(success != 0)
                success = creep.move(BOTTOM);
            if(success != 0)
                success = creep.move(LEFT);
        }
    }
};

function renew(spawn, creep) {
    const renewTry = Game.spawns[spawn].renewCreep(creep);
    if(renewTry == OK)
        creep.say(`🔋⚡`);
    else
        creep.say('🔋🔻');
    return renewTry;
}

module.exports = all;