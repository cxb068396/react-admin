import React, { Component } from 'react';
import { Card, Button, Table, Modal, message } from 'antd'
import { PAGE_SIZE } from '../../utils/constant'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'

import AuthForm from './auth-form'
// import memoryUtils from '../../utils/memoryUtils'
// import storageUtils from '../../utils/storageUtils'
import { formateDate } from '../../utils/dateUtils'
import { connect } from 'react-redux'
import { logout } from '../../redux/actions'
class Role extends Component {
    state = {
        roles: [],//所有角色的列表
        role: {},//选中的角色
        isShowAdd: false,//是否显示添加角色
        isShowAuth: false,//设置权限
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }
    initColumn = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name',
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)

            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate

            },
            {
                title: '授权人',
                dataIndex: 'auth_name',

            },
        ];
    }
    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }
    //获取所有角色列表
    getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }
    UNSAFE_componentWillMount() {
        this.initColumn()
    }
    //添加角色
    addRole = () => {
        //表单验证
        this.form.validateFields(async (error, values) => {
            if (!error) {

                // 隐藏确认框
                this.setState({
                    isShowAdd: false
                })

                // 收集输入数据
                const { rolename } = values
                this.form.resetFields()

                // 请求添加
                const result = await reqAddRole(rolename)
                // 根据结果提示/更新列表显示
                if (result.status === 0) {
                    message.success('添加角色成功')
                    // this.getRoles()
                    // 新产生的角色
                    const role = result.data
                    // 更新roles状态
                    /*const roles = this.state.roles
                    roles.push(role)
                    this.setState({
                      roles
                    })*/

                    // 更新roles状态: 基于原本状态数据更新
                    this.setState(state => ({
                        roles: [...state.roles, role]
                    }))

                } else {
                    message.success('添加角色失败')
                }

            }
        })
    }
    //更新角色权限
    updateRole = async () => {
        const role = this.state.role
        // 隐藏确认框
        this.setState({
            isShowAuth: false
        })
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        // role.auth_name = memoryUtils.user.username
        role.auth_name = this.props.user.username

        role.auth_time = Date.now()
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {

            // this.getRoles()

            //如果当前更新的是自己角色的权限强制退出
            // if (role._id === memoryUtils.user.role_id) {
            if (role._id === this.props.user.role_id) {
                // memoryUtils.user = {}
                // storageUtils.removerUser()
                //  this.props.history.replace('/login')
                this.props.logout()
                message.info('当前用户角色修改来,重新登录')


            } else {
                message.success('设置权限成功')
                this.setState(
                    state => ({
                        roles: [...state.roles]
                    })
                )
            }

        }

    }

    componentDidMount() {
        this.getRoles()
    }
    render() {
        const { roles, role, isShowAdd, isShowAuth } = this.state
        const title = (
            <span>
                <Button type='primary' onClick={() => {
                    this.setState({
                        isShowAdd: true
                    })
                }} style={{ marginRight: 10 }}>创建角色</Button>
                <Button type='primary' disabled={!role._id}
                    onClick={() => {
                        this.setState({
                            isShowAuth: true
                        })
                    }}
                >设置角色的权限</Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    bordered
                    rowKey='_id'
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true

                    }}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: [role._id],
                        onSelect: (role) => {
                            this.setState({
                                role
                            })
                        }
                    }}
                    onRow={this.onRow}
                />;
                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => {
                        this.setState({
                            isShowAdd: false
                        })
                    }}
                >
                    <AddForm
                        setForm={(form) => this.form = form}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => {
                        this.setState({
                            isShowAuth: false
                        })
                    }}
                >
                    <AuthForm
                        role={role}
                        ref={this.auth}
                    />
                </Modal>
            </Card>
        );
    }
}
export default connect(
    state => ({ user: state.user }),
    { logout }
)(Role)