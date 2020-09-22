import React, { Component } from 'react';
import { Card, Table, Button, Modal, message } from 'antd'
import { formateDate } from '../../utils/dateUtils'
import LinkButton from '../../components/link-button';
import { PAGE_SIZE } from '../../utils/constant'
import { reqUsers, reqDeleteUser, reqAddOrUpdateUser } from '../../api/index'
import UserForm from './user-form'

class User extends Component {
    state = {
        users: [],//用户列表
        roles: [],//所有角色的列表
        isShow: false,//控制modal的隐藏
    }
    //根据roles的数组,生成包含所有角色的对象(属性名用角色的id)
    initRoleName = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        //保存
        this.roleNames = roleNames
    }
    //删除指定用户
    deteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    this.getUsers()
                } else {
                    message.error('删除用户失败')
                }
            }
        })
    }
    //显示添加界面
    showAdd = () => {
        this.user = null
        this.setState({
            isShow: true
        })
    }
    //修改用户
    showUpdate = (user) => {
        this.user = user //保存user
        this.setState({
            isShow: true
        })
    }
    iniitColumns = () => {
        this.columns = [
            {
                title: '用户名',
                dataIndex: 'username'
            },
            {
                title: '邮箱',
                dataIndex: 'email'
            },
            {
                title: '电话',
                dataIndex: 'phone'
            },
            {
                title: '注册时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '所属角色',
                dataIndex: 'role_id',
                // render: (role_id) => this.state.roles.find(role => role._id === role_id).name
                render: (role_id) => this.roleNames[role_id]
            },
            {
                title: '操作',
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => { this.showUpdate(user) }}>修改</LinkButton>
                        <LinkButton onClick={() => this.deteUser(user)}>删除</LinkButton>
                    </span>

                )

            }

        ]
    }
    //添加或者更新用户
    addOrUpdateUser = () => {
        //表单验证
        this.form.validateFields(async (err, values) => {
            if (!err) {
                this.setState({
                    isShow: false
                })
                const user = values
                //如果是更新,需要给user指定_id
                if (this.user) {
                    user._id = this.user._id
                }
                const result = await reqAddOrUpdateUser(user)
                if (result.status === 0) {
                    message.success(`${this.user ? '修改' : '添加'}用户成功`)
                    this.getUsers()
                } else {
                    message.error(`${this.user ? '修改' : '添加'}用户失败`)
                }
            }

        })

    }
    componentWillMount() {
        this.iniitColumns()
    }
    //获取用户的列表
    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleName(roles)
            this.setState({
                users,
                roles
            })
        }

    }
    componentDidMount() {
        this.getUsers()
    }
    render() {
        const title = (
            <span>
                <Button type='primary' onClick={this.showAdd}>创建用户</Button>
            </span>
        )
        const { users, isShow, roles } = this.state
        const user = this.user || {}
        return (
            <Card title={title}>

                <Table
                    bordered
                    rowKey='_id'
                    dataSource={users}
                    columns={this.columns}
                    pagination={{
                        defaultPageSize: PAGE_SIZE, showQuickJumper: true
                    }}
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={isShow}
                    onOk={this.addOrUpdateUser}
                    onCancel={() => {
                        this.setState({
                            isShow: false
                        })
                        this.form.resetFields()
                    }}
                >
                    <UserForm
                        setForm={(form) => { this.form = form }}
                        roles={
                            roles
                        }
                        user={user}
                    />
                </Modal>
            </Card>
        );
    }
}
export default User