import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
    Form,
    Icon,
    Input,
    Button,
    message
} from 'antd'
import './login.less'
import logo from './../../assets/images/logo.png'
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'



const Item = Form.Item // 不能写在import之前

class Login extends Component {
    handleSubmit = (event) => {
        //阻止表单的默认行为
        event.preventDefault()
        // //得到强大的from对象
        // const form = this.props.form
        // //获得表单的输入数据
        // const values = form.getFieldsValue()
        // console.log(values)
        this.props.form.validateFields(async (err, values) => {
            //校验成功
            if (!err) {
                console.log('提交登录的ajax请求:', values);
                const { username, password } = values
                //请求登录
                const result = await reqLogin(username, password)
                if (result.status === 0) { // 登陆成功
                    // 提示登陆成功
                    message.success('登陆成功')

                    // 保存user
                    const user = result.data
                    memoryUtils.user = user // 保存在内存中
                    storageUtils.saveUser(user) // 保存到local中

                    // // 跳转到管理界面 (不需要再回退回到登陆)
                    this.props.history.replace('/')

                } else { // 登陆失败
                    // 提示错误信息
                    message.error(result.msg)
                }

            } else {
                console.log('检验失败!')
            }
        });
    }

    //验证password
    validatePwd = (rule, value, callback) => {
        if (!value) {
            callback('密码不能为空')
        } else if (value.length < 4) {
            callback('密码长度不能小于4')
        } else if (value.length > 12) {
            callback('密码长度不能大于12')
        } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            callback('密码必须是英文、数字或下划线组成')
        } else {
            callback()
        }
    }
    render() {
        //如果用户已经登录,自动跳转到admin
        const user = memoryUtils.user
        if (user && user._id) {
            return <Redirect to='/' />
        }
        // 得到具强大功能的form对象
        const form = this.props.form
        console.log(form)
        const { getFieldDecorator } = form;
        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登陆</h2>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Item>
                            {
                                /*
                              用户名/密码的的合法性要求
                                1). 必须输入
                                2). 必须大于等于4位
                                3). 必须小于等于12位
                                4). 必须是英文、数字或下划线组成
                               */
                            }
                            {
                                getFieldDecorator('username', { // 配置对象: 属性名是特定的一些名称
                                    // 声明式验证: 直接使用别人定义好的验证规则进行验证
                                    rules: [
                                        { required: true, whitespace: true, message: '用户名必须输入' },
                                        { min: 4, message: '用户名至少4位' },
                                        { max: 12, message: '用户名最多12位' },
                                        { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数字或下划线组成' },
                                    ],
                                    initialValue: 'admin', // 初始值
                                })(
                                    <Input
                                        prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        placeholder="用户名"
                                    />
                                )
                            }
                        </Item>
                        <Form.Item>
                            {
                                getFieldDecorator('password', {
                                    rules: [
                                        {
                                            validator: this.validatePwd
                                        }
                                    ]
                                })(
                                    <Input
                                        prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                        type="password"
                                        placeholder="密码"
                                    />
                                )
                            }

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
              </Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

//高阶函数  
// 1.一类特别的函数
//.接收函数的参数
//.返回值是函数
// 2.常见的高阶函数
//setTimeout()/setInterval()
//promise :Promise(()=>{}) then(value=>{},reason=>{})   
//数组遍历的相关方法 forEach() /fitter/map/reduce()/find()/findIndex()
//函数对象的bind方法
// Form.create() /getFieldDecorator()()
// 3.高阶函数更新动态,更加具有扩展性

//高阶组件
//1.本质就是一个函数
//2.接收一个组件(被包装组件),返回一个新的组件(包装组件),包装组件会向被包装组件传入特定的属性
//3.作用:扩展组件的功能
//4.高阶组件也是一个高阶函数,接收一个组件函数,返回的是一个新的组件函数


// -----------------------------------



/*包装form组件形成新的组件  From(Login)
新组件会向From组件传递一个强大的对象属性:from
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin
//前台表单验证
//收集表单的输入值
