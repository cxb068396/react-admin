/*入口js*/
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
//将app组件标签渲染到index页面上
ReactDom.render( <
    App / > ,
    document.querySelector('#root')
)