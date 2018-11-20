
import Auth from '@/auth.js'
import Frameset from '@/frameset.js'
import $Common from '@/common.js'
import $Server from '@/server.js'
import Env from '~/__env/env.js'
import MockMain from '~/__env/mock_main.js'
import MockAdminuser from '~/__env/mock_adminuser.js'

const Mocks = {
  'main': MockMain,
  'adminuser': MockAdminuser
}

Auth.init(Env.systemId, Env.component, {
  defaultNotLoginHandler: function () {
    Frameset.SonFunc.sendErrorToParent(Auth.ERROR_MODULE, Auth.ErrorCode.NOT_LOGIN.v)
  },
  defaultNoPageAuthHandler: function () {
    Frameset.SonFunc.sendErrorToParent(Auth.ERROR_MODULE, Auth.ErrorCode.PAGE_AUTH.v)
  }
})

const _errorHandlers = {}
function setErrorHandler (errorCode, errorHanderFunc) {
  _errorHandlers[errorCode] = errorHanderFunc
}
_errorHandlers[Auth.ErrorCode.NOT_LOGIN.v] = Frameset.SonFunc.sendErrorToParent
_errorHandlers[Auth.ErrorCode.URI_AUTH.v] = Frameset.SonFunc.sendErrorToParent
_errorHandlers[Auth.ErrorCode.DATA_AUTH.v] = Frameset.SonFunc.sendErrorToParent
_errorHandlers[Auth.ErrorCode.KICKED_OUT.v] = Frameset.SonFunc.sendErrorToParent

const Servers = new $Server.Servers(Env.serverBase, Env.mock ? Mocks : null, {
  getHttpHeaders: function () {
    return Auth.httpHeaders()
  },
  errorHandlers: _errorHandlers
})
function $ (name) {
  return Servers.request(name)
}
function main () {
  return Servers.request(Servers.Main())
}
function self () {
  return Servers.request(Servers.Self())
}

Frameset.Son.option({
  componentName: Env.component,
  syncParentEnvFunc: function (parentEnv) {
    Env.syncParent(parentEnv)
    Auth.init(Env.systemId, Env.component)
    Servers.init(Env.serverBase, Env.mock ? Mocks : null)
  },
  loginCtxNotifyFunc: function (loginCtx, pageConfigs) {
    Auth.setLoginCtx(loginCtx, pageConfigs)
  }
})

function componentPageUrl (component, uri) {
  if (Env.pageBase) {
    return Env.pageBase[component] + uri
  }
  return Env.serverBase[component] + uri
}

function pageUrl (path, fromUrl) {
  if (path === null) {
    return ''
  }
  if (path.length > 2 && path.charAt(0) === '/') {
    let component = path.substring(1, path.indexOf('/', 2))
    let uri = path.substr(path.indexOf('/', 2))
    return componentPageUrl(component, uri)
  } else {
    if (!fromUrl && self.location && self.location.hash) {
      fromUrl = self.location.hash.substr(1)
    }
    if (fromUrl) {
      fromUrl = $Common.getAbsoluteUrl(fromUrl)

      let queryHash = $Common.getQueryHashString(path)

      let absoluteUrl = $Common.getAbsoluteUrl(path, fromUrl)

      path = $Common.getRelativePath(absoluteUrl) + queryHash
    }
    return path
  }
}

function fullComponentPageUrl (component, uri) {
  return $Common.getAbsoluteUrl(componentPageUrl(component, uri))
}

function fullPageUrl (path) {
  return $Common.getAbsoluteUrl(pageUrl(path))
}

export default {
  $, main, self, setErrorHandler, componentPageUrl, pageUrl, fullComponentPageUrl, fullPageUrl
}
