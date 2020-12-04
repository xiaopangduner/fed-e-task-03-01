let Vue

export default class VueRouter {
  static install (vue) {
    if (VueRouter.install.installed) { return }
    VueRouter.install.installed = true
    Vue = vue
    Vue.mixin({
      beforeCreate () {
        if (this.$options.router) {
          Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }

  constructor (options) {
    this.$options = options
    this.mode = options.mode || 'hash'
    this.routeMap = {}
    this.data = Vue.observable({
      current: '/'
    })
  }

  init () {
    this.bindEvent()
    this.createRouteMap()
    this.initComponent()
  }

  onHashChange () {
    console.log(location.hash)
    this.data.current = location.hash.slice(1)
  }

  onStateChange () {
    this.data.current = location.pathname
  }

  bindEvent () {
    if (this.mode === 'hash') {
      if (!location.hash) {
        location.hash = '/'
      }
      window.addEventListener('load', this.onHashChange.bind(this))
      window.addEventListener('hashchange', this.onHashChange.bind(this))
    } else {
      if (!location.pathname) {
        location.pathname = '/'
      }
      window.addEventListener('load', this.onStateChange.bind(this))
      window.addEventListener('popstate', this.onStateChange.bind(this))
    }
  }

  createRouteMap () {
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }

  initComponent () {
    const _this = this
    Vue.component('router-link', {
      props: { to: String },
      render (h) {
        let url
        if (_this.mode === 'hash') {
          url = `#${this.to}`
        } else {
          url = this.to
        }
        return h('a', {
          attrs: { href: url },
          on: {
            click: _this.mode === 'hash' ? this.hashClickHandler : this.historyClickHandler
          }
        },
        [this.$slots.default])
      },
      methods: {
        hashClickHandler (e) {
          location.hash = this.to
          this.$router.current = this.to
          e.preventDefault()
        },
        historyClickHandler (e) {
          history.pushState({}, '', this.to)
          this.$router.current = this.to
          e.preventDefault()
        }
      }
    })
    Vue.component('router-view', {
      render (h) {
        const el = _this.routeMap[_this.data.current]
        return h(el)
      }
    })
  }
}
