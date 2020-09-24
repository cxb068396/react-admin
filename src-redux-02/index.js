/*入口js*/
import React from 'react'
import ReactDom from 'react-dom'
import App from './App'
import store from './redux/store'
import { Provider } from 'react-redux'
//将app组件标签渲染到index页面上
ReactDom.render(
    <Provider store={store}>
        <App /> ,
    </Provider>,

    document.querySelector('#root')
)

// //给store绑定状态更新的监听

// store.subscribe(() => {
//     ReactDom.render( <
//         App store = {
//             store
//         }
//         / > ,
//         document.querySelector('#root')
//     )
// })