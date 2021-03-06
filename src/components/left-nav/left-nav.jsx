import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd';
import logo from '../../assets/images/logo.png'
import './left-nav.less'
import menuList from '../../config/menuConfig'
// import memoryUtils from '../../utils/memoryUtils'

import { connect } from 'react-redux'
import { setHeadTitle } from '../../redux/actions'
const { SubMenu } = Menu;
class LeftNav extends Component {
    rootSubmenuKeys = ['/products', '/charts'];
    state = {
        openKeys: [],
    };
    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const { key, isPublic } = item
        // const menus = memoryUtils.user.role.menus
        // const username = memoryUtils.user.username
        const menus = this.props.user.role.menus
        const username = this.props.user.username
        //1.如果当前用户是admin
        //2.如果当前item是公开的
        //3.当前用户有此item的权限:key有没有在menus中
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
        } else if (item.children) { // 4. 如果当前用户有此item的某个子item的权限 !!强制转换成bole值
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }
        return false

    }
    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({ openKeys });
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    };
    //根据menu的数组数组生成对应的标签数组
    //使用map()+递归调用
    getMenuNodes_map = (menuList) => {
        return menuList.map((item, index) => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span>{item.title}</span>
                        </Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu
                        key={item.key}
                        title={
                            <span>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </span>
                        }
                    >
                        {this.getMenuNodes_map(item.children)}

                    </SubMenu>
                )
            }

        })
    }

    /*
    根据menu的数据数组生成对应的标签数组
    使用reduce() + 递归调用
    */
    getMenuNodes = (menuList) => {
        // 得到当前请求的路由路径
        const path = this.props.location.pathname
        console.log(this.props)

        return menuList.reduce((pre, item) => {

            // 如果当前用户有item对应的权限, 才需要显示对应的菜单项

            if (this.hasAuth(item)) {
                // 向pre添加<Menu.Item>
                if (!item.children) {
                    //判断item是否是当前的对应的item
                    if (item.key === path || path.indexOf(item.key) === 0) {

                        //  更新redux中的headtitle状态
                        this.props.setHeadTitle(item.title)
                    }
                    pre.push((
                        <Menu.Item key={item.key}>
                            <Link to={item.key} onClick={() => this.props.setHeadTitle(item.title)}>
                                <Icon type={item.icon} />
                                <span>{item.title}</span>
                            </Link>
                        </Menu.Item>
                    ))
                } else {

                    // 查找一个与当前请求路径匹配的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key) === 0)
                    // 如果存在, 说明当前item的子列表需要打开
                    if (cItem) {
                        this.openKey = item.key
                    }


                    // 向pre添加<SubMenu>
                    pre.push((
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                    <Icon type={item.icon} />
                                    <span>{item.title}</span>
                                </span>
                            }
                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    ))
                }

            }

            return pre
        }, [])
    }
    /*
在第一次render()之前执行一次
为第一个render()准备数据(必须同步的)
 */
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMenuNodes(menuList)
    }
    render() {
        //得到当前请求的路径
        let path = this.props.location.pathname
        if (path.indexOf('/product') === 0) {
            path = '/product'
        }
        // 得到需要打开菜单项的key
        const openKey = this.openKey
        return (
            <div className='left-nav'>
                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="" />
                    <h1>react后台</h1>
                </Link>
                <Menu
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                    openKeys={this.state.openKeys}
                    onOpenChange={this.onOpenChange}
                >

                    {
                        this.menuNodes
                    }
                </Menu>
            </div>
        );
    }
}

//withRouter高阶组件
//包装非路由组件,返回一个新的组件
//新的组件向非路由组件传递3个属性:history,location,match
export default connect(
    state => ({
        user: state.user
    }),
    { setHeadTitle }
)(withRouter(LeftNav));
