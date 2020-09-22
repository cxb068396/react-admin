import React, { Component } from 'react';
import { Card, Form, Input, Cascader, Button, Icon, message } from 'antd'
import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddOrUpdateProduct } from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEdit from './rich-text-edit';


const { Item } = Form
const { TextArea } = Input


class ProductAddUpdata extends Component {
    state = {
        options: [],
    };
    constructor(props) {
        super(props)

        // 创建用来保存ref标识的标签对象的容器 img
        this.pw = React.createRef()

        //创建用来保存富文本
        this.editor = React.createRef()
    }
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            //如果是一级分类
            if (parentId === '0') {
                this.initOptions(categorys)
            } else {
                //二级列表
                return categorys
            }

        }
    }
    initOptions = async (categorys) => {
        //根据categorys生成options数组
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false,

        }))

        //若果是一个二级分类商品的更新
        const { isUpdate, product } = this
        const { pCategoryId } = product
        if (isUpdate && pCategoryId !== '0') {
            //获取对应的二级分类列表
            const subCategorys = await this.getCategorys(pCategoryId)
            //生成二级下拉列表
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            const targetOption = options.find(option => option.value === pCategoryId)
            //关联到一级的options上
            targetOption.children = childOptions
        }
        this.setState({
            options
        })
    }
    //验证价格的函数
    validatePrice = (rule, value, callback) => {
        if (value * 1 > 0) {
            callback()
        } else {
            callback('价格必须大于0')
        }
    }
    submit = () => {
        //进行整体的表单验证
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                //1.收集数据 ,并且封装成product对象
                const { name, desc, price, categoryIds } = values
                let pCategoryId, categoryId
                if (categoryIds.length === 1) {
                    pCategoryId = '0'
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImgs()
                const detail = this.editor.current.getDetail()
                const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }

                //如果是更新需要添加_id

                if (this.isUpdate) {
                    product._id = this.product._id
                }
                //2.调用接口请求函数,添加回或者更新

                const result = await reqAddOrUpdateProduct(product)
                //3.根据结果提示

                if (result.status === 0) {
                    message.success(`${this.isUpdate ? '更新' : '添加'}商品成功`)
                    this.props.history.goBack()
                } else {
                    message.error(`${this.isUpdate ? '更新' : '添加'}商品失败`)
                }
            }
        })
    }
    //用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        const targetOption = selectedOptions[0];
        targetOption.loading = true;
        //根据选中的分类请求二级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            //关联到当前的option上
            targetOption.children = childOptions
        } else {
            targetOption.isLeaf = true
        }
        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })

    };
    componentDidMount() {
        this.getCategorys('0')
    }
    componentWillMount() {
        const product = this.props.location.state
        this.isUpdate = !!product  //保存是否要跟新的标识
        this.product = product || {}
    }
    render() {
        const { isUpdate, product } = this
        const { pCategoryId, categoryId, imgs, detail } = product
        const categoryIds = []
        if (isUpdate) {
            //商品是一个一级分类商品
            if (pCategoryId === '0') {
                categoryIds.push(pCategoryId)
            } else {
                //商品是一个二级分类商品
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }

        }
        const title = (
            <span>
                <LinkButton onClick={() => { this.props.history.goBack() }}>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} />
                </LinkButton>
                <span>{isUpdate ? '修改商品' : '添加商品'}</span>
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 3 },//左侧label的宽度
            wrapperCol: { span: 8 }, //指定右侧包裹的宽度
        };
        const { getFieldDecorator } = this.props.form
        return (
            <Card title={title}>
                <Form {...formItemLayout} >
                    <Item label='商品名称:'>
                        {
                            getFieldDecorator(
                                'name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '商品名称必须输入' },
                                ]
                            }
                            )(<Input placeholder='请输入商品名称'></Input>)
                        }

                    </Item>
                    <Item label='商品描述:'>
                        {
                            getFieldDecorator(
                                'desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '商品描述必须输入' },
                                ]
                            }
                            )(<TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 6 }}></TextArea>
                            )
                        }
                    </Item>
                    <Item label='商品价格:'>
                        {
                            getFieldDecorator(
                                'price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '商品价格必须输入' },
                                    { validator: this.validatePrice }
                                ]
                            }
                            )(<Input type='number' placeholder='请输入商品价格' addonAfter='元'></Input>
                            )
                        }

                    </Item>
                    <Item label='商品分类:'>
                        {
                            getFieldDecorator(
                                'categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '指定商品分类' },
                                ]
                            }
                            )(<Cascader
                                placeholder='请指定商品分类'
                                options={this.state.options}
                                loadData={this.loadData}
                            />)
                        }

                    </Item>
                    <Item label='商品图片:'>
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item label='商品详情:' labelCol={{ span: 3 }}
                        wrapperCol={{ span: 20 }}>
                        <RichTextEdit ref={this.editor} detail={detail}></RichTextEdit>
                    </Item>
                    <Button type='primary' onClick={this.submit}>提交</Button>
                </Form>
            </Card>
        );
    }
}

export default Form.create()(ProductAddUpdata);