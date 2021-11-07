const data = require("./config");

Creep.prototype.setWork = setWork
Creep.prototype.getWork = getWork
Creep.prototype.clearWork = clearWork
Creep.prototype.isStoreFull = isStoreFull
Creep.prototype.isStoreEmpty = isStoreEmpty
Creep.prototype.getConfig = getConfig
Creep.prototype.isRenewing = isRenewing
Creep.prototype.shouldWork = shouldWork
Creep.prototype.hasWork = hasWork

Structure.prototype.isStoreFull = isStoreFull
Structure.prototype.isStoreEmpty = isStoreEmpty

function setWork(name, id) {
    this.memory.work = { name: name, id: id }
}

function getWork() {
    return this.memory.work
}

function clearWork() {
    this.memory.work = { name: '', target: undefined }
}

function isStoreFull(resource) {
    if(this.store.getFreeCapacity(resource) <= 0) 
        return true
    else 
        return false
}

function isStoreEmpty(resource) {
    if(this.store.getUsedCapacity(resource) <= 0) 
        return true
    else 
        return false
}

function getConfig() {
    return data.roles[this.memory.role]
}

function isRenewing() {
    if(this.memory.renewing || this.memory.needsRenewing)
        return true
    else
        return false
}

function shouldWork() {
    if(data.roles[this.memory.role].enableWorking)
        return true
    else
        return false
}

function hasWork() {
    const work = this.getWork()
    if(!this.memory.work && !work.name)
        return
    else
        return 
}