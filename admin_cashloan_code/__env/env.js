const Basic = {
  systemId: 'cashloan',
  component: 'admin'
}

const CommonEnvs = {
  cins: {
    env: 'cins',
    debug: false,
    serverBase: {
      main: '/admin',
      adminuser: '/global/adminuser',
      'loan.mgmt': '/cashloan/loan.mgmt',
      'loan.report': '/cashloan/loan.report',
      instuff: '/cashloan/instuff',
      channel_report: '/cashloan/channel_report'
    },
    pageBase: {
      main: '/web',
      adminuser: '/global/adminuser/web',
      'loan.mgmt': '/cashloan/loan.mgmt/web',
      'loan.report': '/cashloan/loan.report/web',
      instuff: '/cashloan/instuff/web',
      eshop: '/cashloan/eshop/web',
      channel_report: '/cashloan/channel_report/web'
    },
    serverBaseInOneServer: function (serverPrefix, withBases) {
      let newBases = {
        main: serverPrefix + '/admin',
        adminuser: serverPrefix + '/global/adminuser',
        'loan.mgmt': serverPrefix + '/cashloan/loan.mgmt',
        'loan.report': serverPrefix + '/cashloan/loan.report',
        instuff: serverPrefix + '/cashloan/instuff',
        channel_report: serverPrefix + '/cashloan/channel_report'
      }
      if (withBases) {
        newBases = Object.assign(newBases, withBases)
      }
      return newBases
    }
  },
  local: {
    env: 'local',
    mock: true,
    debug: true,
    serverBase: {
    },
    pageBase: {
      main: '/cashloan',
      adminuser: '/adminuser',
      'loan.mgmt': '/loan.mgmt',
      'loan.report': '/loan.report',
      instuff: '/instuff',
      channel_report: '/channel_report',
      app: 'http://localhost/cashloan/pages/'
    }
  }
}

const Envs = {
  'local': CommonEnvs.local,
  'cins': CommonEnvs.cins,
  'prod': {
    env: 'prod',
    debug: false,
    serverBase: CommonEnvs.cins.serverBase,
    pageBase: Object.assign({}, CommonEnvs.cins.pageBase, {
      app: 'http://hbt.wangluodaikuankouzi.com/pages/'
    })
  },
  'uat': {
    env: 'uat',
    debug: false,
    serverBase: CommonEnvs.cins.serverBase,
    pageBase: Object.assign({}, CommonEnvs.cins.pageBase, {
      app: 'http://47.99.163.162/cashloan/pages/'
    })
  },
  'demo': {
    env: 'demo',
    mock: true,
    debug: true,
    serverBase: {
    },
    pageBase: {
      main: '/demo',
      adminuser: '/global/adminuser/demo',
      'loan.mgmt': '/cashloan/loan.mgmt/demo',
      'loan.report': '/cashloan/loan.report/demo',
      instuff: '/cashloan/instuff/demo',
      eshop: '/cashloan/eshop/demo',
      channel_report: '/cashloan/channel_report/demo',
      app: 'http://47.99.163.162/cashloan/pages/'
    }
  },
  'dev': {
    env: 'dev',
    debug: true,
    stopSwitch: true,
    serverBase: CommonEnvs.cins.serverBaseInOneServer('http://localhost:8101'),
    pageBase: CommonEnvs.local.pageBase
  },
  'dev_uat': {
    env: 'dev_uat',
    debug: true,
    stopSwitch: true,
    serverBase: CommonEnvs.cins.serverBaseInOneServer('http://47.99.163.162:8101'),
    pageBase: Object.assign({}, CommonEnvs.local.pageBase, {
      app: 'http://47.99.163.162/cashloan/pages/'
    })
  },
  'dev_prod': {
    env: 'dev_prod',
    debug: true,
    stopSwitch: true,
    serverBase: CommonEnvs.cins.serverBaseInOneServer('http://47.99.163.162:8101'),
    pageBase: Object.assign({}, CommonEnvs.local.pageBase, {
      app: 'http://47.99.163.162/cashloan/pages/'
    })
  }
}
let pageEnv = document.body.dataset.env
let Env = {
  syncParent: function (parentEnv) {
    if (Env.component === parentEnv.component) {
      return
    }
    parentEnv.serverBase.main = parentEnv.serverBase[Env.component]
    if (!parentEnv.serverBase.main) {
      parentEnv.serverBase.main = Env.serverBase.main
    }
    Env = Object.assign(Env, parentEnv)
  },

  switchEnv: function (envKey, fromWhere) {
    if (Env.stopSwitch) {
      return
    }
    let envObj = Envs[envKey]
    if (!envObj) {
      envObj = Envs['local']
    }
    Env = Object.assign(Env, Basic, envObj)

    console.log('------------------ env ------------------ [')
    console.log(envKey + ' from ' + fromWhere)
    console.log(Env)
    console.log('------------------ env ------------------ ]')
  }
}

Env.switchEnv(pageEnv, 'document.body.dataset')

export default Env
