import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaHome, FaBriefcase, FaSignOutAlt} from 'react-icons/fa'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }
  const onClickHomeLogo = () => {
    const {history} = props
    history.replace('/')
  }
  return (
    <>
      <nav className="nav-cont desktop-nav-cont">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>

        <ul className="header-list">
          <li>
            <Link to="/" className="link-item">
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link-item">
              Jobs
            </Link>
          </li>
        </ul>
        <button className="logout-btn" type="button" onClick={onClickLogout}>
          Logout
        </button>
      </nav>
      <nav className="nav-cont mobile-nav-cont">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo"
          />
        </Link>
        <ul className="mobile-nav-link-items-cont">
          <li>
            <Link to="/" className="link-item">
              <FaHome />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="link-item">
              <FaBriefcase />
            </Link>
          </li>
          <li>
            <button
              className="mobile-logout-btn"
              type="button"
              onClick={onClickLogout}
            >
              <FaSignOutAlt />
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default withRouter(Header)
