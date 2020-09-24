import React, { Component } from 'react'
// import memoryUtils from '../../utils/memoryUtils'
import { Redirect, Route, Switch } from 'react-router-dom'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'
import { connect } from 'react-redux'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import User from '../user/user'
import Role from '../role/role'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import Line from '../charts/line'
import Order from '../order/order'
import Error from '../error/error'




const { Footer, Sider, Content } = Layout;
class Admin extends Component {
    render() {
        // const user = memoryUtils.user

        const user = this.props.user
        //如果内存中没有存储user===》当前没有登录
        if (!user || !user._id) {
            return <Redirect to='/login' />
        }
        return (

            <Layout style={{ minHeight: '100%' }}>
                <Sider>
                    <LeftNav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content style={{ margin: 20, backgroundColor: '#fff' }}>
                        <Switch>
                            <Redirect exact from='/' to='/home' />
                            <Route path='/home' component={Home} />
                            <Route path='/category' component={Category} />
                            <Route path='/product' component={Product} />
                            <Route path='/role' component={Role} />
                            <Route path='/user' component={User} />
                            <Route path='/charts/bar' component={Bar} />
                            <Route path='/charts/line' component={Line} />
                            <Route path='/charts/pie' component={Pie} />
                            <Route path='/order' component={Order} />
                            <Route component={Error} />
                        </Switch>

                    </Content>
                    <Footer style={{ textAlign: 'center', color: '#ccc' }}>推荐使用谷歌浏览器,可以获得更佳的操作体验</Footer>
                </Layout>
            </Layout>

        )
    }
}
export default connect(
    state => ({ user: state.user }),
    {}
)(Admin)
