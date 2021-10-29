const data = require("./config");

Creep.prototype.setWork = setWork
Creep.prototype.getWork = getWork
Creep.prototype.clearWork = clearWork
Creep.prototype.isStoreFull = isStoreFull
Creep.prototype.isStoreEmpty = isStoreEmpty
Creep.prototype.getConfig = getConfig

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
    if(this.store.getFreeCapacity(resource) <= 0) return true
    else return false
}

function isStoreEmpty(resource) {
    if(this.store.getUsedCapacity(resource) <= 0) return true
    else return false
}

function getConfig() {
    return data.roles[this.memory.role]
}
