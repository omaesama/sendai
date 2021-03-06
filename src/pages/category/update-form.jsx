import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {Form,Input} from 'antd'
class UpdateForm extends Component {
  static propTypes = {
    categoryName: PropTypes.string.isRequired,
    setForm:PropTypes.func.isRequired
  }
  componentWillMount() {
    this.props.setForm(this.props.form)
  }
  render() {
    const {categoryName} = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form> 
        <Form.Item>
        {
          getFieldDecorator('categoryName', {
            initialValue:categoryName,
            rules:[
              { required: true, message: 'please input category name' }
            ]
          })(
            <Input placeholder="please input category name" /> 
          )
        }
        </Form.Item>
      </Form>
    )
  }
}
export default Form.create()(UpdateForm)
