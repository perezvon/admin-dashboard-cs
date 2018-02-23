import React from 'react'
import {Table} from './Table'
import {Button, FormControl} from 'react-bootstrap'

export default class ApproveDeny extends React.Component {
  constructor(props) {
    super(props)
    this.state = {...this.props}
  }

  componentWillReceiveProps (props) {
      this.setState({
        ...props
      })
  }
  handleInput = (e, index) => {
    let field, value;
    if (e.target.type === 'checkbox') {
      field = 'approved'
      value = e.target.checked
    }
    else {
      field = 'approve_deny_notes'
      value = e.target.value
    }
    const newData = this.state.data
    newData[index] = {...this.state.data[index], [field]: value}
    this.setState(prevState => ({
      ...prevState,
      data: newData
    }))
  }
  handleSubmit = (e) => {
    e.preventDefault()
    let data = []
    this.state.data.forEach(o => {
      if (o.approved) o.status = 'P'
      if (!o.approved) {
        o.approved = false
        o.status = 'D'
      }
      data.push(o)
    })
    //appears to automatically update and empty itself after updating status -- why?
    this.props.approveOrDenyOrders(data)
    //call to cs-cart api to update order statuses
  }

  render () {
    const {data} = this.state
    console.log(data)
    const headers = ['Order', 'Name', 'Total', 'Approved?', 'Notes'].map(i => <td>{i}</td>)
    const tableData = data.map((i, index) => <tr key={index}>
      <td>{i.order_id}</td>
      <td>{i.b_firstname ? i.b_firstname + ' ' + i.b_lastname : i.email}</td>
      <td>{`$${i.total}`}</td>
      <td>
        <label className="switch">
          <input type="checkbox" checked={i.approved} onChange={e => this.handleInput(e, index)} />
          <span className="slider round"></span>
        </label>
      </td>
      <td><FormControl componentClass="textarea" placeholder='Enter notes for employee here (optional)' value={i.approve_deny_notes} onChange={e => this.handleInput(e, index)}></FormControl></td>
    </tr>)
    return (
      <div>
        <Table headers={headers} tableData={tableData} />
        <Button className='btn-success' onClick={this.handleSubmit}>Submit</Button>
      </div>
    )
  }
}
