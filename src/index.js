/*入口js*/
import React from 'react'
import ReactDom from 'react-dom'
import 'antd/dist/antd.css'

import App from './App'


// 读取local中保存的user,保存到内存中
import storageUtils from './utils/storageUtils'
import memoryUtils from './utils/memoryUtils'
const user = storageUtils.getUser()
memoryUtils.user = user
//将app组件标签渲染到index页面上
ReactDom.render( <
    App / > ,
    document.querySelector('#root')
)