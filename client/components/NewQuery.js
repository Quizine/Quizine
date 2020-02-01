import React, {Component} from 'react'
import axios from 'axios'

export class NewQuery extends Component {
  render() {
    return (
      <div>
        <select>
          <option>Menu</option>
          <option>Servers</option>
          <options>Orders</options>
        </select>
      </div>
    )
  }
}

export default NewQuery
