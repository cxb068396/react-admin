import React, { Component } from 'react'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'
import {
    Form,
    Input,
    Tree
} from 'antd'
const { TreeNode } = Tree;

const Item = Form.Item



/*
添加分类的form组件
 */
export default class AuthForm extends Component {

    static propTypes = {
        role: PropTypes.object
    }
    //根据传入角色的menus确定初始状态
    constructor(props) {
        super(props)
        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }
    UNSAFE_componentWillMount() {
        this.treeNodes = this.getTreeNodes(menuList)
    }
    getTreeNodes = (menuList) => {
        return menuList.reduce((pre, item) => {
            pre.push(
                <TreeNode title={item.title} key={item.key}>

                    {
                        item.children ? this.getTreeNodes(item.children) : null
                    }
                </TreeNode>
            )
            return pre
        }, [])
    }
    onCheck = checkedKeys => {
        console.log('onCheck', checkedKeys);
        this.setState({ checkedKeys });
    };
    //为父组件提交获取最新menus数据的方法
    getMenus = () => {
        return this.state.checkedKeys
    }
    //根据新传入的role来更新checkedKeys的状态
    //组件接收到新的属性时自动调用
    componentWillReceiveProps(nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys: menus
        })
    }
    render() {
        const { role } = this.props
        const { checkedKeys } = this.state

        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 16 }, //指定右侧包裹的宽度
        };
        return (
            <Form  {...formItemLayout}>
                <Item label='角色名称'>
                    <Input value={role.name} disabled />
                </Item>
                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={
                        this.onCheck
                    }
                >

                    <TreeNode title="平台权限" key="all">
                        {this.treeNodes}
                    </TreeNode>
                </Tree>
            </Form>
        )
    }
}

