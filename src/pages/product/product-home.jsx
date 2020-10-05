import React, { Component } from 'react'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api'
import {
  Card,
  Select,
  Button,
  Icon,
  Table,
  Input,
  Divider,
  Tag,
  message
} from 'antd'
import { PAGE_SIZE } from '../../utils/constants'
const { Option } = Select
export default class ProductHome extends Component {
  state = {
    list: [],
    total: 0,
    loading: false,
    currentPage: 1,
    searchName: '',
    searchType: 'productName'
  }
  initColumns() {
    this.columns = [
      {
        title: '商品名',
        dataIndex: 'name',
        key: 'name'
      },
      {
        title: '商品説明',
        dataIndex: 'desc',
        key: 'desc'
      },
      {
        title: '価格',
        dataIndex: 'price',
        render: price => '￥' + price
      },
      {
        title: '状態',
        width: 100,
        render: product => {
          const { _id, status } = product
          return (
            <span>
              <Tag
                onClick={this.updateStatus.bind(
                  this,
                  _id,
                  parseInt(status) === 1 ? 2 : 1
                )}
                color="red"
              >
                {parseInt(status) === 1 ? '販売中' : '売り切り'}
              </Tag>
            </span>
          )
        }
      },
      {
        title: '操作',
        width: 200,
        render: product => {
          return (
            <span>
              <b
                onClick={() => {
                  this.props.history.push('/product/edit', { product })
                }}
                className="ant-dropdown-link"
              >
                修正
              </b>
              <Divider type="vertical" />
              <b
                onClick={() => {
                  this.props.history.push('/product/detail', { product })
                }}
                className="ant-dropdown-link"
              >
                詳細
              </b>
            </span>
          )
        }
      }
    ]
  }
  async updateStatus(id, status) {
    await reqUpdateStatus(id, status)
    message.success('更新しました。')
    this.getProduct(this.state.currentPage)
  }
  async getProduct(pageNum) {
    this.setState({
      loading: true
    })
    const { searchName, searchType } = this.state
    let result
    if (searchName && searchType) {
      result = await reqSearchProducts({
        pageNum,
        pageSize: PAGE_SIZE,
        searchName,
        searchType
      })
    } else {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }

    const { total, list } = result.data
    this.setState({
      total,
      list,
      currentPage: pageNum,
      loading: false
    })
  }
  onChangePage(page) {
    this.getProduct(page)
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProduct(1)
  }
  render() {
    const {
      loading,
      list,
      total,
      searchName,
      searchType,
      currentPage
    } = this.state
    const title = (
      <span>
        <Select
          onChange={val => this.setState({ searchType: val })}
          defaultValue={searchType}
          style={{ width: 150 }}
        >
          <Option key="1" value="productName">
            名前で検索
          </Option>
          <Option key="2" value="productDesc">
            説明で検索
          </Option>
        </Select>
        <Input
          placeholder="KEY　WORDを入力してください"
          value={searchName}
          onChange={e => this.setState({ searchName: e.target.value })}
          style={{ width: 150, margin: '0 15px' }}
        />
        <Button
          type="primary"
          onClick={() => {
            this.getProduct(1)
          }}
        >
         検索
        </Button>
      </span>
    )
    const extra = (
      <Button
        onClick={() => {
          this.props.history.push('/product/edit')
        }}
      >
        <Icon type="plus" />
       商品追加
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          size="small"
          dataSource={list}
          rowKey="_id"
          loading={loading}
          columns={this.columns}
          pagination={{
            total: total,
            current: currentPage,
            defaultPageSize: PAGE_SIZE,
            showQuickJumper: true,
            onChange: this.onChangePage.bind(this)
          }}
        ></Table>
      </Card>
    )
  }
}
