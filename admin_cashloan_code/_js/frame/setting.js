export default {
  siteConfig: {
    'titleObj': {
      'iconClass': 'fa fa-paw',
      'imgUrl': null,
      'title': '风驰信贷系统',
      'url': ''
    }
  },
  menuViewConfig: [
    {
      'name': 'dashboard.html',
      'iconClass': 'fa fa-dashboard'
    },
    {
      'hr': true,
      'name': 'risked.html',
      'iconClass': 'fa fa-check-square-o'
    },
    {
      'name': 'audited.html',
      'iconClass': 'fa fa-pencil'
    },
    {
      'name': 'signed.html',
      'iconClass': 'fa fa-pencil-square-o'
    },
    {
      'name': 'to-pay.html',
      'iconClass': 'fa fa-send'
    },
    {
      'name': 'unrepaid.html',
      'iconClass': 'fa fa-hourglass-1'
    },
    {
      'name': 'marked',
      'iconClass': 'fa fa-ravelry'
    },
    {
      'name': 'overdue',
      'iconClass': 'fa fa-warning'
    },
    {
      'name': 'loan-list',
      'iconClass': 'fa fa-cubes'
    },
    {
      'name': 'orders.html',
      'iconClass': 'fa fa-cart-arrow-down'
    },
    {
      'hr': true,
      'name': 'reports',
      'iconClass': 'fa fa-bar-chart'
    },
    {
      'name': 'csm_reports',
      'iconClass': 'fa fa-area-chart'
    },
    {
      'hr': true,
      'name': 'users_groups',
      'iconClass': 'fa fa-group'
    },
    {
      'name': 'orgnizations',
      'iconClass': 'fa fa-institution'
    },
    {
      'name': 'demo',
      'iconClass': 'el-icon-menu'
    },
    {
      'name': 'channel_report',
      'iconClass': 'fa fa-bar-chart-o'
    }
  ],
  demoAuthorityKeys: [
    'ABC',
    'AUDIT',
    'COLLECT',
    'REPORT',
    'STAFF',
    'MANAGER_LOAN_VIEW',
    'ORGNAZATION'
  ],
  defaultPageTip: [
    '这种情况点这里',
    '那种情况点那里'],
  pageTips: {// key与页面的hash值一致
    'demo-table.html': ['表格页的操作提示'],
    'demo-form.html': [
      '表单页的操作提示，',
      '换行，balabala']
  }
}
