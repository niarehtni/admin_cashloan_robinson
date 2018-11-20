export default [
  {
    'demo': true, // index页面需过滤该demo为true的
    'name': 'demo',
    '_title': '示例页面组', // 去掉title前的下划线，该菜单项就不隐藏了
    'submenus': [
      {
        'url': 'demo/table.html',
        'title': '表格示例页'
      }, {
        'url': 'demo/form.html',
        'title': '表单示例页'
      }
    ]
  }, {
    'name': 'dashboard.html',
    'url': '/loan.report/dashboard.html',
    'title': '数据概览'
  }, {
    'name': 'risked.html',
    'url': '/loan.mgmt/risked.html',
    'title': '待审核'
  }, {
    'name': 'to-pay.html',
    'url': '/loan.mgmt/to-pay.html',
    'title': '待放款'
  }, {
    'name': 'unrepaid.html',
    'url': '/loan.mgmt/unrepaid.html',
    'title': '待还款'
  }, {
    'name': 'marked',
    'url': '/loan.mgmt/repaid-marked.html',
    'title': '待财务提现'
  }, {
    'name': 'overdue',
    'url': '/loan.mgmt/unrepaid-overdue.html?overdueDaysGe=1',
    'title': '已逾期'
  }, {
    'name': 'loan-list',
    'title': '借款列表',
    'submenus': [
      {
        'url': '/loan.mgmt/loan-list.html',
        'title': '借款查询列表'
      }, {
        'url': '/loan.mgmt/repaying-list.html',
        'title': '账单查询列表'
      }, {
        'url': '/loan.mgmt/applied.html',
        'title': '待风控评估'
      }, {
        'url': '/loan.mgmt/paying.html',
        'title': '系统放款中'
      }, {
        'url': '/loan.mgmt/refused.html',
        'title': '已拒绝的申请'
      }
    ]
  }, {
    'name': 'reports',
    'title': '贷款报表',
    'submenus': [
      {
        'url': '/loan.report/dayloanweekhistory.html',
        'title': '总借还款报表'
      }, {
        'url': '/loan.report/dayloanweeksum.html',
        'title': '周借还款报表'
      }, {
        'url': '/loan.report/dayloanweekoverdue.html',
        'title': '逾期还款报表'
      }
    ]
  }, {
    'name': 'csm_reports',
    'title': '客户经理报表',
    'submenus': [
      {
        'url': '/loan.report/accountManagerDay.html',
        'title': '日报表'
      }, {
        'url': '/loan.report/accountManagerMonth.html',
        'title': '月报表'
      }
    ]
  }, {
    'name': 'users_groups',
    'title': '系统用户',
    'submenus': [
      {
        'url': '/adminuser/user-list.html',
        'title': '用户列表'
      }, {
        'url': '/adminuser/group-list.html',
        'title': '组列表'
      }
    ]
  },
  {
    'name': 'orgnizations',
    'url': '/adminuser/institutions-list.html',
    'title': '机构列表'
  },
  {
    'name': 'channel_report',
    'title': '渠道管理',
    'submenus': [
      {
        'url': '/channel_report/report-list.html',
        'title': '渠道报表'
      }, {
        'url': '/channel_report/channel-list.html',
        'title': '渠道列表'
      }
    ]
  }
]
