import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errorText: '',
    errorOccured: false,
  }

  handleSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    console.log(response)
    if (response.ok) {
      const jwtToken = data.jwt_token
      Cookies.set('jwt_token', jwtToken, {expires: 6})
      const {history} = this.props
      history.replace('/')
    } else {
      console.log(data)
      this.setState({
        errorOccured: true,
        errorText: data.error_msg,
        username: '',
        password: '',
      })
    }
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  render() {
    const {username, password, errorText, errorOccured} = this.state
    const jwtToken = Cookies.get('jwt_token')
    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form onSubmit={this.handleSubmit}>
          <div className="login-logo">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <div className="input-group">
            <label className="login-form-label-text" htmlFor="Username">
              USERNAME
            </label>
            <input
              type="text"
              value={username}
              id="Username"
              onChange={this.onChangeUsername}
              placeholder="Username"
            />
          </div>
          <div className="input-group">
            <label className="login-form-label-text" htmlFor="Password">
              Password
            </label>
            <input
              type="password"
              value={password}
              id="Password"
              onChange={this.onChangePassword}
              placeholder="Password"
            />
          </div>
          <button type="submit">Login</button>
          {errorOccured && <p className="error-message">*{errorText}</p>}
        </form>
      </div>
    )
  }
}

export default Login
