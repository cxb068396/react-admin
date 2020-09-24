import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Select
} from 'antd'

const Item = Form.Item
const Option = Select.Option



/*
添加/修改用户的form组件
 */
class UserForm extends PureComponent {

    static propTypes = {
        setForm: PropTypes.func.isRequired, // 用来传递form对象的函数
        roles: PropTypes.array.isRequired, // 用来传递form对象的函数
        user: PropTypes.object // 用来传递form对象的函数
    }

    UNSAFE_componentWillMount() {
        this.props.setForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { roles } = this.props
        const user = this.props.user || {}
        const formItemLayout = {
            labelCol: { span: 4 },//左侧label的宽度
            wrapperCol: { span: 16 }, //指定右侧包裹的宽度
        };
        return (
            <Form  {...formItemLayout}>
                <Item label='用户名'>
                    {
                        getFieldDecorator('username', {
                            initialValue: user.username,
                            rules: [
                                { required: true, message: '请输入用户名' }
                            ]
                        })(
                            <Input placeholder='请输入用户名' />
                        )
                    }
                </Item>
                {
                    user._id ? null : (
                        <Item label='密码'>
                            {
                                getFieldDecorator('password', {
                                    initialValue: user.password,
                                    rules: [
                                        { required: true, message: '请输入密码' }
                                    ]
                                })(
                                    <Input type='password' placeholder='请输入密码' />
                                )
                            }
                        </Item>
                    )
                }

                <Item label='手机号'>
                    {
                        getFieldDecorator('phone', {
                            initialValue: user.phone,
                            rules: [
                                { required: true, message: '请输入手机号' }
                            ]
                        })(
                            <Input placeholder='请输入手机号' />
                        )
                    }
                </Item>
                <Item label='邮箱'>
                    {
                        getFieldDecorator('email', {
                            initialValue: user.email,
                            rules: [
                                { required: true, message: '请输入邮箱' }
                            ]
                        })(
                            <Input placeholder='请输入邮箱' />
                        )
                    }
                </Item>
                <Item label='角色'>
                    {
                        getFieldDecorator('role_id', {
                            initialValue: user.role_id,
                            rules: [
                                { required: true, message: '请选择角色' }
                            ]
                        })(
                            <Select>
                                {
                                    roles.map((role, index) =>
                                        <Option value={
                                            role._id
                                        }
                                            key={index}
                                        >{role.name}</Option>
                                    )
                                }
                            </Select>

                        )
                    }
                </Item>
            </Form>
        )
    }
}

export default Form.create()(UserForm)