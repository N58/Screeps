const tower = {

    run: function() {
        for (const name in Game.structures) {
            const structure = Game.structures[name];
            if (structure.structureType == STRUCTURE_TOWER)
            {
                const target = structure.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(target) {
                    structure.attack(target)
                }
            }
        }
    }
};

module.exports = tower;