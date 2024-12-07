import {Component} from 'react'
import Cookies from 'js-cookie'

import {FaStar, FaBriefcase} from 'react-icons/fa'
import {MdLocationOn} from 'react-icons/md'
import {IoMdOpen} from 'react-icons/io'

import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
}

class JobDetails extends Component {
  state = {
    jobDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getJobDetails()
  }

  getJobDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {pathId} = params
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${pathId}`
    console.log(apiUrl)
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const eachJob = data.job_details
      const similarJobs = data.similar_jobs
      const updatedJobDetails = {
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        lifeAtCompany: {
          description: eachJob.life_at_company.description,
          imageUrl: eachJob.life_at_company.image_url,
        },
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        skills: eachJob.skills.map(job => ({
          name: job.name,
          imageUrl: job.image_url,
        })),
        title: eachJob.title,
      }
      const updatedSimilarJobs = similarJobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        id: job.id,
        jobDescription: job.job_description,
        title: job.title,
        rating: job.rating,
        location: job.location,
      }))
      this.setState({
        jobDetails: updatedJobDetails,
        similarJobs: updatedSimilarJobs,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderJobDetailsCard = () => {
    const {jobDetails} = this.state
    const {
      jobDescription,
      location,
      companyLogoUrl,
      employmentType,
      packagePerAnnum,
      title,
      rating,
      skills = [],
      lifeAtCompany = {imageUrl: '', description: ''},
      companyWebsiteUrl,
    } = jobDetails
    return (
      <div className="job-card-bg-cont">
        <div className="jobs-card-logo-and-title-cont">
          <img
            src={companyLogoUrl}
            alt="job details company logo"
            className="profile-icon"
          />
          <div className="title-rating-cont">
            <h1 className="job-title">{title}</h1>
            <p className="rating-text">
              <FaStar className="rating-icon" />
              {rating}
            </p>
          </div>
        </div>
        <div className="location-div-package-cont">
          <div className="location-emp-typ-cont">
            <p className="icon-text-cont">
              <MdLocationOn className="mr-5" />
              {location}
            </p>
            <p className="icon-text-cont">
              <FaBriefcase className="mr-5" />
              {employmentType}
            </p>
          </div>
          <p>{packagePerAnnum}</p>
        </div>
        <hr className="hr-line" />
        <div className="desc-cont">
          <div className="des-company-link-cont">
            <h1 className="job-title">Description</h1>
            <a
              href={companyWebsiteUrl}
              target="_blank"
              className="website-link"
              rel="noreferrer"
            >
              Visit
              <IoMdOpen />
            </a>
          </div>
          <p>{jobDescription}</p>
        </div>
        <div className="skills-bg-cont">
          <h1 className="job-title mr-5">Skills</h1>
          <ul className="skills-cont">
            {skills.map(skill => {
              const {imageUrl, name} = skill
              return (
                <li className="skill-cont" key={name}>
                  <img src={imageUrl} alt={name} className="skill-img" />
                  <p>{name}</p>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="life-at-company-bg-cont">
          <div>
            <h1 className="job-title">Life at Company</h1>
            <p>{lifeAtCompany.description}</p>
          </div>
          <img
            src={lifeAtCompany.imageUrl}
            alt="life at company"
            className="life-at-company-img"
          />
        </div>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-cont">
      <div data-testid="loader">
        <Loader type="TailSpin" color="#0284c7" height={80} width={80} />
      </div>
    </div>
  )

  renderSimilarJobsCont = () => {
    const {similarJobs} = this.state
    return (
      <div>
        <h1 className="similar-jobs">Similar Jobs</h1>

        <ul className="jobs-list-cont similar-jobs-bg-cont">
          {similarJobs.map(eachJob => {
            const {
              id,
              jobDescription,
              location,
              companyLogoUrl,
              employmentType,
              title,
              rating,
            } = eachJob
            const onClickJobDetails = () => {
              const {history} = this.props
              history.replace(`/jobs/${id}`)
              window.location.reload()
            }
            return (
              <li className="job-card-bg-cont similar-job-bg-cont" key={id}>
                <button
                  className="jobs-card-button"
                  onClick={onClickJobDetails}
                  type="button"
                >
                  <div className="jobs-card-logo-and-title-cont mr-bt">
                    <img
                      src={companyLogoUrl}
                      alt="similar job company logo"
                      className="profile-icon"
                    />
                    <div className="title-rating-cont">
                      <h1 className="job-title">{title}</h1>
                      <p className="rating-text">
                        <FaStar className="rating-icon" />
                        {rating}
                      </p>
                    </div>
                  </div>
                  <div className="desc-cont">
                    <h1 className="job-title">Description</h1>
                    <p>{jobDescription}</p>
                  </div>
                  <div className="location-div-package-cont">
                    <div className="location-emp-typ-cont">
                      <p className="icon-text-cont">
                        <MdLocationOn className="mr-5" />
                        {location}
                      </p>
                      <p className="icon-text-cont">
                        <FaBriefcase className="mr-5" />
                        {employmentType}
                      </p>
                    </div>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }

  onClickJobDetailsRetryBtn = () => {
    this.setState(
      {apiStatus: apiStatusConstants.inProgress},
      this.getJobDetails,
    )
  }

  renderFailureView = () => (
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
          onClick={this.onClickJobDetailsRetryBtn}
        >
          Retry
        </button>
      </div>
    </div>
  )

  renderJobDetailsSection = () => (
    <>
      {this.renderJobDetailsCard()}
      {this.renderSimilarJobsCont()}
    </>
  )

  renderFinalView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsSection()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="job-details-bg-cont">
        <Header />
        <div className="bottom-sec-jd-cont">{this.renderFinalView()}</div>
      </div>
    )
  }
}

export default JobDetails
