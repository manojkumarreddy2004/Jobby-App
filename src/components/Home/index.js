import {Component} from 'react'

import {Link} from 'react-router-dom'
import Header from '../Header'
import './index.css'

class Home extends Component {
  handleFindJobsClick = () => {
    const {history} = this.props
    history.push('/jobs')
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="home-bottom-section">
          <div className="home-content-container">
            <h1 className="heading">Find The Job That Fits Your Life</h1>
            <p className="description">
              Millions of people are searching for jobs, salary information,
              company reviews. Find the job that fits your abilities and
              potential.
            </p>
            <Link to="/jobs">
              <button
                className="find-jobs-button"
                onClick={this.handleFindJobsClick}
                type="button"
              >
                Find Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }
}

export default Home
