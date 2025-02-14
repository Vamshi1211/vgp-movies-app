import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import Header from '../Header'
// import Footer from '../Footer'

import MoviesContext from '../../context/MoviesContext'
import './index.css'

const apiStatusValue = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  failure: 'FAILURE',
  success: 'SUCCESS',
}

class Search extends Component {
  state = {
    apiStatus: apiStatusValue.initial,
    searchInput: '',
    searchResults: [],
  }

  //   componentDidMount() {
  //     this.getSearchResults()
  //   }

  getSearchResults = async () => {
    const {searchInput} = this.state
    this.setState({apiStatus: apiStatusValue.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const url = `https://apis.ccbp.in/movies-app/movies-search?search=${searchInput}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(url, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const data = fetchedData.results.map(eachItem => ({
        id: eachItem.id,
        posterPath: eachItem.poster_path,
      }))

      this.setState({searchResults: data, apiStatus: apiStatusValue.success})
    } else {
      this.setState({apiStatus: apiStatusValue.failure})
    }
  }

  renderLoadingSearchView = () => (
    <>
      <div className="search-loader-container" testid="loader">
        <Loader type="TailSpin" color="#D81F26" height={50} width={50} />
      </div>
    </>
  )

  renderSearchView = () => {
    const {searchResults, searchInput} = this.state

    return (
      <>
        {searchResults.length > 0 ? (
          <ul className="search-list-container">
            {searchResults.map(eachResult => {
              const {id, posterPath, title} = eachResult

              return (
                <li className="search-list-item" key={id}>
                  <Link to={`/movies/${id}`}>
                    <img
                      src={posterPath}
                      alt={title}
                      className="search-poster"
                    />
                  </Link>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="no-search-result-container">
            <img
              src="https://res.cloudinary.com/dxs4gnnbs/image/upload/v1719304094/Group_7394_yhycld.png"
              alt="no movies"
              className="no-search-result-image"
            />
            <p className="no-movies-des">
              Your search for {searchInput} did not find any matches.
            </p>
          </div>
        )}
      </>
    )
  }

  onClickRetry = () => {
    this.getSearchResults()
  }

  renderFailureSearchView = () => (
    <div className="search-failure-container">
      <img
        src="https://res.cloudinary.com/dxs4gnnbs/image/upload/v1719224516/Icon_j5mhse.png"
        alt="failure view"
        className="search-failure-image"
      />
      <p className="search-failure-description">
        Something went wrong. Please try again
      </p>
      <button
        type="button"
        className="search-try-again"
        onClick={this.onClickRetry}
      >
        Try Again
      </button>
    </div>
  )

  renderSearchViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusValue.inProgress:
        return this.renderLoadingSearchView()
      case apiStatusValue.success:
        return this.renderSearchView()
      case apiStatusValue.failure:
        return this.renderFailureSearchView()

      default:
        return null
    }
  }

  onChangeSearch = searchValue => {
    this.setState({searchInput: searchValue})
  }

  onClickSearch = () => {
    this.getSearchResults()
  }

  render() {
    const {searchInput} = this.state

    return (
      <MoviesContext.Provider
        value={{
          searchInput,
          onChangeSearch: this.onChangeSearch,
          onClickSearch: this.onClickSearch,
        }}
      >
        <div className="search-bg-container">
          <Header />
          {this.renderSearchViews()}
        </div>
      </MoviesContext.Provider>
    )
  }
}

export default Search
