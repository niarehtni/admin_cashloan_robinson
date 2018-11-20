import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/display.css'
import Frameset from '@/frameset.js'
import Auth from '@/auth.js'
import Env from '~/__env/env.js'
import Common from '~/_js/common.js'
import Server from '~/_js/server.js'
import PageAuthSetting from '~/_js/frame/page_auth_setting.js'
import DemoMenu from '~/_js/frame/menu.js'
import DemoSetting from '~/_js/frame/setting.js'
import DemoLoginCtx from '@/DemoLoginCtx'

Vue.use(ElementUI)
const Message = ElementUI.Message

Common.initHtmlHead('风驰-现金贷')

let _data = {
  siteConfig: DemoSetting.siteConfig,
  menuAuth: false,
  menuFloat: false,
  menuShow: true,
  menuCollapse: false,
  menuList: Common.mergeArrayByKey(DemoMenu, DemoSetting.menuViewConfig, 'name'),
  mainFrameSrc: self.location.hash ? self.location.hash.substr(1) : '',
  selectedMenu: Common.getPath(self.location.hash ? self.location.hash.substr(1) : ''),
  urlBeforeForceLogin: null,
  lastErrorCode: null,
  Auth: Auth,
  Server: Server,
  DemoSetting: DemoSetting,
  Env: Env
}

var _mainFrameEle = document.getElementById('mainframe')

let Page
export default {
  components: {
    DemoLoginCtx
  },
  data () {
    return _data
  },
  computed: {
  },
  created () {
    Page = this

    Page.loadEnvconf()
    if (document.body.offsetWidth > 1056) {
      _data.menuCollapse = false
    } else if (document.body.offsetWidth > 768) {
      _data.menuCollapse = true
    } else {
      _data.menuShow = false
      _data.menuFloat = true
    }

    let pageAuthConfigs = {}
    for (let component in PageAuthSetting) {
      for (let pageUri in PageAuthSetting[component]) {
        let fullPageUrl = Server.fullPageUrl(component + pageUri)
        pageAuthConfigs[fullPageUrl] = PageAuthSetting[component][pageUri]
      }
    }
    Auth.setPageAuthConfigs(pageAuthConfigs)
  },
  mounted () {
    Auth.setLoginCtx(JSON.parse(window.localStorage.getItem('Admin.Login.Ctx.' + Env.systemId)))
    console.log('loginCtx:' + JSON.stringify(Auth.getLoginCtx()))
    if (Env.mock) {
      let systemId = this.$refs.demoLoginCtx.init(Env.systemId, DemoSetting.demoAuthorityKeys)
      if (systemId) {
        Env.systemId = systemId
      }
    }

    _mainFrameEle = document.getElementById('mainframe')
    Frameset.Parent.init({
      onSonCreatedFunc: this.onSonCreated,
      onSonFlowDoneFunc: this.onSonFlowDone,
      onSonErrorFunc: this.onSonError,
      sonGoUrlFunc: this.sonGoUrl
    })

    Page.refreshMenuAuth()

    Page.checkLogin()
  },
  methods: {
    onLoadError (errorModule, errorCode, errorMsg) {
      Message.error({
        duration: 0,
        showClose: true,
        message: '加载失败！' + errorModule + '.' + errorCode + '/' + errorMsg
      })
    },
    onActionError (errorModule, errorCode, errorMsg) {
      Message.error({
        duration: 0,
        showClose: true,
        message: '操作失败！' + errorModule + '.' + errorCode + '/' + errorMsg
      })
    },
    loadEnvconf () {
      Server.$().uri('/envconf/v1/')
        .success(function (envconf) {
          Env.switchEnv(envconf.env, 'server')
        })
        .error(Page.onLoadError)
        .post()
    },
    menuTitleClicked () {
      Page.mainFrameGoUrl(DemoSetting.siteConfig.titleObj.url)
      _data.menuShow = false
    },
    onMenuSelect (index, indexPath) {
      document.body.scrollTop = document.documentElement.scrollTop = 0
      Page.mainFrameGoUrl(index)
      _data.menuShow = false
    },
    refreshMenuAuth (menus) {
      if (!menus) {
        menus = Page.menuList
      }

      let forbiddenPages = Auth.getForbiddenPages()

      let authMenuCount = 0
      for (let i = 0; i < menus.length; i++) {
        let menu = menus[i]

        if (menu.submenus) {
          let authSubmenuCount = Page.refreshMenuAuth(menu.submenus)
          if (authSubmenuCount > 0) {
            menu.auth = true
            authMenuCount++
          } else {
            menu.auth = false
          }
        } else {
          if (menu.url) {
            let pageFullUrl = Common.withoutQueryHash(Server.fullPageUrl(menu.url))
            if (forbiddenPages[pageFullUrl]) {
              menu.auth = false
            } else {
              menu.auth = true
              authMenuCount++
            }
          } else {
            menu.auth = true
            authMenuCount++
          }
        }
      }

      if (menus === Page.menuList && authMenuCount === 0) {
        Page.menuAuth = false
      } else {
        Page.menuAuth = true
      }
      return authMenuCount
    },
    mainFrameGoUrl (toUrl, fromUrl) {
      if (toUrl !== '') {
        if (!fromUrl) {
          fromUrl = _data.mainFrameSrc
        }
        toUrl = Server.pageUrl(toUrl, fromUrl)
        _data.mainFrameSrc = toUrl + '#iframerand' + Math.random()
      } else {
        _data.mainFrameSrc = ''
      }
      _data.selectedMenu = toUrl
      history.replaceState('', '', '#' + toUrl) // 不使用location.hash是因为不想产生新历史记录
    },
    sonGoUrl (iframeEle, toUrl, toTarget, fromUrl) {
      if (toTarget) {
        toUrl = Server.pageUrl(toUrl, fromUrl)
        window.open(Common.getPathQuery() + '#' + toUrl, toTarget)
        return
      }
      if (iframeEle === _mainFrameEle) {
        Page.mainFrameGoUrl(toUrl, fromUrl)
      } else {
        if (toUrl === null) {
          toUrl = ''
        }
        iframeEle.src = toUrl
      }
    },
    onSonCreated (iframeEle, pageUrl) {
      Page.lastErrorCode = null
      var pageRelativePath = Common.getRelativePath(pageUrl)
      _data.selectedMenu = pageRelativePath
      history.replaceState('', '', '#' + pageRelativePath + Common.getQueryHashString(pageUrl)) // 不使用location.hash是因为不想产生新历史记录
      if (Auth.getLoginCtx()) {
        Frameset.Parent.sendLoginCtx(iframeEle.name, Env, Auth.getLoginCtx(), Auth.getPageConfigs(Server.fullPageUrl(pageRelativePath)))
      } else {
        Frameset.Parent.sendLoginCtx(iframeEle.name, Env, null, null)
      }
    },
    onSonFlowDone (iframeEle, pageUrl, data) {
      Page.lastErrorCode = null
      var idx = pageUrl.indexOf('?')
      if (idx > 0) {
        pageUrl = pageUrl.substr(0, idx)
      }
      idx = pageUrl.indexOf('#')
      if (idx > 0) {
        pageUrl = pageUrl.substr(0, idx)
      }

      // alert('00' + pageUrl + '--' + Server.fullPageUrl('adminuser', '/login.html'))
      // alert('11' + iframeEle.name)
      if (iframeEle.name === 'mainframe') {
        // alert('22')
        if (pageUrl === Server.fullPageUrl('/adminuser/login.html')) {
          if (data.logout) {
            Page.localLogout()
            return
          }
          // alert(JSON.stringify(data))
          Page.onLogined(data)
        } else if (pageUrl === Server.fullPageUrl('/adminuser/change-password.html')) {
          if (data.logout) {
            Page.localLogout()
          }
        } else if (pageUrl === Server.fullPageUrl('/adminuser/create-user.html')) {
          if (data && data.customStuffKey) {
            switch (data.customStuffKey) {
              // 本系统不需要判断customStuffKey
              //              case 'CSM':
              default:
                Page.mainFrameGoUrl('/loan.mgmt/user-edit.html?au=' + encodeURIComponent(JSON.stringify(data)))
            }
          }
        } else if (pageUrl === Server.fullPageUrl('/loan.mgmt/user-edit.html')) {
          if (data && data.customStuffKey) {
            let adminuserUserEditUrl = Common.setQueryObj('/adminuser/create-user.html', data)
            Page.mainFrameGoUrl(adminuserUserEditUrl)
          }
        }
      }
    },
    onSonError (iframeEle, pageUrl, errorModule, errorCode, errorMsg) {
      if (Page.lastErrorCode === errorCode) {
        return
      }
      Page.lastErrorCode = errorCode
      switch (errorCode) {
        case Auth.ErrorCode.NOT_LOGIN.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '请先登录！'
          })

          Page.urlBeforeForceLogin = pageUrl
          Page.localLogout(true)
          break
        case Auth.ErrorCode.URI_AUTH.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '您无该操作权限！'
          })

          break
        case Auth.ErrorCode.DATA_AUTH.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '数据权限错误！'
          })

          break
        case Auth.ErrorCode.KICKED_OUT.v:
          Message.error({
            duration: 0,
            showClose: true,
            message: '账号在他处登录，您已被迫下线！'
          })

          Page.localLogout(true)
          break
        case Auth.ErrorCode.PAGE_AUTH.v:
          Message.error({
            duration: 3000,
            showClose: true,
            message: '您无权访问该页面，为您跳转前一个页面！',
            onClose () {
              // debug 暂时注释
              // Frameset.Parent.sendGoUrl('mainframe', -1)
            }
          })

          break
        default:
          Page.onActionError(errorModule, errorCode, errorMsg)
      }
    },
    onLogined (loginCtx) {
      if (Env.mock) {
        loginCtx = this.$refs.demoLoginCtx.ctx
      }

      Auth.setLoginCtx(loginCtx)
      Page.refreshMenuAuth()
      Frameset.Parent.sendLoginCtx('mainframe', Env, Auth.getLoginCtx())
      window.localStorage.setItem('Admin.Login.Ctx.' + Env.systemId, JSON.stringify(Auth.getLoginCtx()))

      Message.success({
        message: '登录成功！'
      })

      window.localStorage.setItem('Admin.Login.checkTime.' + Env.systemId, new Date().getTime())

      if (Page.urlBeforeForceLogin) {
        Page.mainFrameSrc = Page.urlBeforeForceLogin
        Page.urlBeforeForceLogin = null
      }
    },
    localLogout (noTip) {
      Auth.setLoginCtx(null)
      window.localStorage.removeItem('Admin.Login.checkTime.' + Env.systemId)
      window.localStorage.removeItem('Admin.Login.Ctx.' + Env.systemId)

      if (!noTip) {
        Message.success({
          message: '已退出登录！'
        })
      }
      this.mainFrameGoUrl('/adminuser/login.html?logout=' + Math.random())
    },
    checkLogin () {
      if (!Auth.login) {
        // 如果未登录，不需要检查
        return
      }

      let checkedMilliSeconds = window.localStorage.getItem('Admin.Login.checkTime.' + Env.systemId)
      if (checkedMilliSeconds) {
        checkedMilliSeconds = parseInt(checkedMilliSeconds)
        if (new Date().getTime() - checkedMilliSeconds < 1800 * 1000) {
          // 如果刚检查过，不需要检查
          return
        }
      }

      Server.$('adminuser').uri('/session/v1/check').data({'systemId': Env.systemId, 'sessionId': Auth.getLoginCtx().sessionId})
        .success(function (data) {
          if (!data) {
            Page.localLogout()
          } else {
            window.localStorage.setItem('Admin.Login.checkTime.' + Env.systemId, new Date().getTime())
          }
        })
        .error(Page.onLoadError)
        .post()
    },
    onAccountCommand (command) {
      switch (command) {
        case 'toLogin':
          this.mainFrameGoUrl('/adminuser/login.html')
          break
        case 'toLogout':
          Server.$('adminuser').uri('/session/v1/logout').data({'systemId': Env.systemId, 'sessionId': Auth.getLoginCtx().sessionId})
            .success(function (data) {
            })
            .error(Page.onLoadError)
            .post()
          this.localLogout()
          break
        case 'toChangePassword':
          this.mainFrameGoUrl('/adminuser/change-password.html')
          break
      }
    },
    onDemoAuthCtxSubmit (demoLoginCtx) {
      console.log(demoLoginCtx)
      Frameset.Parent.sendLoginCtx('mainframe', Env, demoLoginCtx, Auth.getPageConfigs(Server.fullPageUrl(_data.selectedMenu)))
      Auth.setLoginCtx(demoLoginCtx)
      Page.refreshMenuAuth()
    }
  }
}
