const buildingsFactory = {

    roadCheck: function(creep) { 
        if(creep.memory.role != 'builder' && creep.memory.role != 'fixer')
        {
            const structures = creep.room.lookForAt(LOOK_STRUCTURES, creep.pos.x, creep.pos.y);
            let hasRoad = false;
            for (const structure of structures) {
                if(structure.structureType == STRUCTURE_ROAD) {
                    hasRoad = true;
                    return;
                }
            }
            
            if(!hasRoad)
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
        }
    }
};

module.exports = buildingsFactory;