import React, {Component} from 'react'

export class WelcomePage extends Component {
  render() {
    return (
      <div className="welcome-page">
        <div className="context">
          <h1>Welcome to Quizine</h1>
          <h2>Where your restaurants become profitable</h2>
        </div>

        <div className="area">
          <ul className="circles">
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
          </ul>
        </div>
      </div>
    )
  }
}

export default WelcomePage
