import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import {FaStar, FaBriefcase} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    selectedEmploymentTypesList: [],
    salaryRange: '',
    searchText: '',
    jobsListApiStatus: apiStatusConstants.inProgress,
    profileDetailsApiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getprofileDetails()
    this.getJobsList()
  }

  getprofileDetails = async () => {
    const apiUrl = 'https://apis.ccbp.in/profile'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const profileDetails = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileDetails,
        profileDetailsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({profileDetailsApiStatus: apiStatusConstants.failure})
    }
  }

  getJobsList = async () => {
    const {searchText, selectedEmploymentTypesList, salaryRange} = this.state
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${selectedEmploymentTypesList.join(
      ',',
    )}&minimum_package=${salaryRange}&search=${searchText}`
    console.log(apiUrl)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const {jobs} = data
      const updatedJobsList = jobs.map(eachJob => ({
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
      }))
      this.setState({
        jobsList: updatedJobsList,
        jobsListApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({jobsListApiStatus: apiStatusConstants.failure})
    }
  }

  handleOnChangeEmplymentTypeCheckBoxes = event => {
    this.setState(prevState => {
      const {selectedEmploymentTypesList} = prevState
      if (event.target.checked) {
        return {
          selectedEmploymentTypesList: [
            ...selectedEmploymentTypesList,
            event.target.value,
          ],
        }
      }
      return {
        selectedEmploymentTypesList: selectedEmploymentTypesList.filter(
          eachEmploymentType => eachEmploymentType !== event.target.value,
        ),
      }
    }, this.getJobsList)
  }

  onChangeSalaryRange = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsList)
  }

  onChangeSearchText = event => {
    this.setState({searchText: event.target.value})
  }

  onClickSearchBtn = () => {
    this.getJobsList()
  }

  renderProfileDetailsCard = () => {
    const {profileDetails, profileDetailsApiStatus} = this.state
    const {name, profileImageUrl, shortBio} = profileDetails

    switch (profileDetailsApiStatus) {
      case apiStatusConstants.success:
        return (
          <div className="profile-detials-bg-cont">
            <img
              src={profileImageUrl}
              className="profile-icon"
              alt="profile"
              aria-label="user-profile-image"
            />
            <h1 className="profile-name" id="profileName">
              {name}
            </h1>

            <p id="profileShortBio">{shortBio}</p>
          </div>
        )
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobsSearch = () => (
    <div className="search-cont">
      <input
        type="search"
        className="search-input-box"
        placeholder="Search"
        onChange={this.onChangeSearchText}
      />
      <button
        className="search-icon-btn"
        onClick={this.onClickSearchBtn}
        type="button"
        data-testid="searchButton"
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  renderEmploymentTypeCheckBoxes = () => {
    const {selectedEmploymentTypesList} = this.state
    return (
      <div className="filters-cont">
        <hr className="hr-line" />
        <h2 className="job-filters-heading" id="typeOfEmploymentHeading">
          Type of Employment
        </h2>

        <ul className="employment-types-checkbox-cont">
          {employmentTypesList.map(eachEmploymentType => {
            const {label, employmentTypeId} = eachEmploymentType

            return (
              <li className="li-item" key={employmentTypeId}>
                <input
                  type="checkbox"
                  value={employmentTypeId}
                  id={employmentTypeId}
                  className="check-box"
                  checked={selectedEmploymentTypesList.includes(
                    employmentTypeId,
                  )}
                  onChange={this.handleOnChangeEmplymentTypeCheckBoxes}
                />
                <label htmlFor={employmentTypeId} className="label-text">
                  {label}
                </label>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  renderSalaryRangeOptions = () => {
    const {salaryRange} = this.state
    return (
      <div className="filters-cont">
        <hr className="hr-line" />
        <h1 className="job-filters-heading" id="salaryRangeHeading">
          Salary Range
        </h1>

        <ul className="employment-types-checkbox-cont">
          {salaryRangesList.map(eachSalaryRange => (
            <li className="li-item" key={eachSalaryRange.salaryRangeId}>
              <input
                type="radio"
                value={eachSalaryRange.salaryRangeId}
                id={eachSalaryRange.salaryRangeId}
                className="check-box round-check-box"
                onChange={this.onChangeSalaryRange}
                checked={salaryRange === eachSalaryRange.salaryRangeId}
              />
              <label
                htmlFor={eachSalaryRange.salaryRangeId}
                className="label-text"
              >
                {eachSalaryRange.label}
              </label>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  onClickJobDetails = id => {
    const {history} = this.props
    history.replace(`/jobs/${id}`)
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    if (jobsList.length === 0) {
      return this.renderNoJobsView()
    }
    return (
      <ul className="jobs-list-cont">
        {jobsList.map(eachJob => {
          const {
            id,
            jobDescription,
            location,
            companyLogoUrl,
            employmentType,
            packagePerAnnum,
            title,
            rating,
          } = eachJob
          return (
            <li className="job-card-bg-cont" key={id}>
              <button
                className="jobs-card-button"
                onClick={() => {
                  this.onClickJobDetails(id)
                }}
                type="button"
              >
                <div className="jobs-card-logo-and-title-cont">
                  <img
                    src={companyLogoUrl}
                    alt="company logo"
                    className="profile-icon"
                  />
                  <div className="title-rating-cont">
                    <h1 className="job-title">{title}</h1>
                    <p className="rating-text">
                      <FaStar className="rating-icon" />
                      <p>{rating}</p>
                    </p>
                  </div>
                </div>
                <div className="location-div-package-cont">
                  <div className="location-emp-typ-cont">
                    <p className="icon-text-cont">
                      <MdLocationOn className="mr-5" />
                      <p>{location}</p>
                    </p>
                    <p className="icon-text-cont">
                      <FaBriefcase className="mr-5" />
                      <p>{employmentType}</p>
                    </p>
                  </div>
                  <p>{packagePerAnnum}</p>
                </div>
                <hr className="hr-line" />
                <div className="desc-cont">
                  <h1 className="job-title">Description</h1>
                  <p>{jobDescription}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    )
  }

  onClickProfileRetryBtn = () => {
    this.getprofileDetails()
  }

  onClickJobsRetryBtn = () => {
    this.getJobsList()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-cont">
      <button
        className="retry-btn"
        type="button"
        onClick={this.onClickProfileRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-cont">
      <div data-testid="loader">
        <Loader type="TailSpin" color="#0284c7" height={80} width={80} />
      </div>
    </div>
  )

  renderJobsFailureView = () => (
    <div className="jobs-failure-view-bg-cont">
      <div className="jobs-failure-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
          alt="failure view"
          className="jobs-failure-img"
        />
        <h1>Oops! Something Went Wrong</h1>
        <p>We cannot seem to find the page you are looking for</p>
        <button
          className="retry-btn"
          type="button"
          onClick={this.onClickJobsRetryBtn}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderNoJobsView = () => (
    <div className="jobs-failure-view-bg-cont">
      <div className="jobs-failure-cont">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="jobs-failure-img"
        />
        <h1>No Jobs Found</h1>
        <p>We could not find any jobs. Try other filters</p>
      </div>
    </div>
  )

  renderJobsView = () => {
    const {jobsListApiStatus} = this.state
    switch (jobsListApiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderJobsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <div className="jobs-page-bg-cont-desktop">
          <Header />
          <div className="jobs-and-profile-section-cont-desktop">
            <div className="desktop-jobs-left-section">
              {this.renderProfileDetailsCard()}
              {this.renderEmploymentTypeCheckBoxes()}
              {this.renderSalaryRangeOptions()}
            </div>
            <div className="desktop-jobs-right-section">
              {this.renderJobsSearch()}
              {this.renderJobsView()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
