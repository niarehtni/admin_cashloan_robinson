'use strict'

import '@/admin.css'
import '~/_css/common.css'
import $Common from '@/common.js'

var thisModule = {

}

for (var e in $Common) {
  thisModule[e] = $Common[e]
}

export default thisModule
