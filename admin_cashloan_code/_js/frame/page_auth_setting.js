export default {
  '/main': {
    '/demo/table.html': {
      'XXX': {
        'doXxxThing': true
      }
    },
    '/demo/form.html': {
      'XX2': {
        'doXx2Thing': true
      }
    }
  },
  //
  '/adminuser': {
    '/user-list.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'STAFF': {}
    },
    '/group-list.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'STAFF': {}
    },
    '/institutions-list.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'ORGNAZATION': {}
    },
    '/create-user.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'STAFF': {}
    },
    '/create-group.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'STAFF': {}
    },
    '/create-institutions.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'ORGNAZATION': {}
    }
  },
  //
  '/loan.mgmt': {
    '/applied.html': {
      'AUDIT': {}
    },
    '/risked.html': {
      'AUDIT': {}
    },
    '/audited.html': {
      'AUDIT': {}
    },
    '/signed.html': {
      'AUDIT': {}
    },
    '/to-pay.html': {
      'AUDIT': {},
      'FINANCE': {}
    },
    '/unrepaid.html': {
      'COLLECT': {}
    },
    '/repaid-marked.html': {
      'COLLECT': {},
      'FINANCE': {}
    },
    '/unrepaid-overdue.html': {
      'COLLECT': {}
    },
    '/loan-list.html': {
      'AUDIT': {},
      'MANAGER_LOAN_VIEW': {}
    },
    '/repaying-list.html': {
      'MANAGER_LOAN_VIEW': {}
    },
    '/risk-report.html': {
      'AUDIT': {},
      'COLLECT': {},
      'MANAGER_LOAN_VIEW': {}
    },
    '/paying.html': {
      'AUDIT': {}
    },
    '/timeout-applies.html': {
      'AUDIT': {}
    },
    '/refused.html': {
      'AUDIT': {}
    },
    '/user-edit.html': {
      'SYSTEM': {
        'systemManagement': true
      },
      'STAFF': {}
    }
  },
  //
  '/loan.report': {
    '/dashboard.html': {
      'REPORT': {}
    },
    '/dayloanweekhistory.html': {
      'REPORT': {}
    },
    '/dayloanweeksum.html': {
      'REPORT': {}
    },
    '/dayloanweekoverdue.html': {
      'REPORT': {}
    },
    '/accountManagerDay.html': {
      'REPORT': {}
    },
    '/accountManagerMonth.html': {
      'REPORT': {}
    },
    '/daycsmperformance.html': {
      'REPORT': {}
    }
  },
  //
  '/instuff': {
    '/risk-report.html': {
      'AUDIT': {},
      'COLLECT': {},
      'MANAGER_LOAN_VIEW': {}
    }
  },
  //
  '/channel_report': {
    '/report-list.html': {
      'MANAGER_CHANNEL': {},
      'PARTNER_CHANNEL': {}
    },
    '/channel-list.html': {
      'MANAGER_CHANNEL': {}
    },
    '/channel-setup.html': {
      'MANAGER_CHANNEL': {}
    }
  }

}
