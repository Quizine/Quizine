import React, {Component} from 'react'
import Summary from './Summary'

export class Home extends Component {
  render() {
    return (
      <div>
        <h1>Welcome to Nest Egg</h1>
        <h2>Where your restaurants become profitable</h2>
        <Summary />
      </div>
    )
  }
}

export default Home
