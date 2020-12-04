class Compiler {
  constructor (vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }

  compile (el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(item => {
      this.isTextNode(item) && this.compileText(item)
      this.isElementNode(item) && this.compilerElement(item)

      if (item.childNodes && item.childNodes.length > 0) {
        this.compile(item)
      }
    })
  }

  compilerElement (node) {
    Array.from(node.attributes).forEach(attr => {
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }

  update (node, key, attrName) {
    let event = ''
    let updaterFn
    if (attrName.includes('on:')) {
      updaterFn = this.onUpdater
      event = attrName.slice(3)
    } else {
      updaterFn = this[attrName + 'Updater']
    }
    updaterFn && updaterFn.call(this, node, key, this.vm[key], event)
  }

  textUpdater (node, key, value) {
    node.textContent = value
    new Watcher(this.vm, key, (val) => {
      node.textContent = val
    })
  }

  modelUpdater (node, key, value) {
    node.value = value
    new Watcher(this.vm, key, (val) => {
      node.value = val
    })
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }

  htmlUpdater (node, key, value) {
    node.innerHTML = value
    new Watcher(this.vm, key, (val) => {
      node.innerHTML = val
    })
  }

  onUpdater (node, key, value, event) {
    node.addEventListener(event, value)
    new Watcher(this.vm, key, (val) => {
      node.addEventListener(event, val)
    })
  }

  compileText (node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      new Watcher(this.vm, key, (val) => {
        node.textContent = val
      })
    }
  }

  isDirective (attrName) {
    return attrName.startsWith('v-')
  }

  isTextNode (node) {
    return node.nodeType === 3
  }

  isElementNode (node) {
    return node.nodeType === 1
  }
}