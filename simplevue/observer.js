class Observer {
  constructor (data) {
    this.walk(data)
  }

  walk (data) {
    if (!data || typeof data !== 'object') { return }
    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  defineReactive (obj, key, val) {
    this.walk(val)
    const _this = this
    let dep = new Dep()
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get () {
        Dep.target && dep.addSub(Dep.target)
        return val
      },
      set (newVal) {
        _this.walk(newVal)
        if (newVal !== val) {
          val = newVal
        }
        dep.notify()
      }
    })
  }
}