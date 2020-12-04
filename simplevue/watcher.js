class Watcher {
  constructor (vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb
    Dep.target = this
    this.oldVal = vm[key]
    Dep.target = null
  }

  update () {
    const newVal = this.vm[this.key]
    if (newVal === this.oldVal) { return }
    this.cb(newVal)
  }
}