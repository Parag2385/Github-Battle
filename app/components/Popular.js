import React from 'react'
import PropType from 'prop-types'
import {fetchPopularRepos} from '../utils/api'
import {FaUser, FaStar, FaCodeBranch, FaExclamationTriangle} from 'react-icons/fa'

function LanguageNav({selected, onUpdateLanguage}){
    const languages = ['All', 'JavaScript', 'Ruby', 'Java', 'CSS', 'Python']
    console.log(`lang: ${selected}`)
    return(
        <ul className='flex-center'>
            {languages.map((ln) =>(
                <li key={ln}>
                    <button className='btn-clear nav-link'
                    style = {ln === selected ? {color:'rgb(187, 16, 31)'}: {color:'rgb(0, 0, 0)'}}
                    onClick={() => onUpdateLanguage(ln)}>
                        {ln}
                    </button>
                </li>
            ))}
        </ul>
    )
}

LanguageNav.propType = {
    selected: PropType.string.isRequired,
    onUpdateLanguage: PropType.func.isRequired
}

function ReposGrid({repos}){
    return (
        <ul className='grid space-around'>
            {repos.map((repo, index) =>{
                const {name, owner, html_url, stargazers_count, forks, open_issues} = repo
                const {login, avatar_url} = owner

                return(
                    <li key='html_url' className='repo bg-light'>
                        <h4 className='header-lg center-text'>
                            #{index + 1}
                        </h4>
                        <img className='avatar' src={avatar_url} alt={`Avatar for ${login}`}/>
                        <h2 className='center-text'>
                            <a className='link' href={html_url}>{login}</a>
                        </h2>
                        <ul className='card-list'>
                            <li>
                                <FaUser color='rgb(255, 191,116)' size={22}/>
                                <a href={`https://github.com/${login}`}>
                                    {login}
                                </a>
                            </li>
                            <li>
                                <FaStar color='rgb(255, 215, 0)' size={22}/>
                                {stargazers_count.toLocaleString()} stars
                            </li>
                            <li>
                                <FaCodeBranch color='rgb(129, 195, 245)' size={22}/>
                                {forks.toLocaleString()} forks
                            </li>
                            <li>
                                <FaExclamationTriangle color='rgb(241, 138, 147)' size={22}/>
                                {open_issues.toLocaleString()} open issues
                            </li>
                        </ul>
                    </li>
                )
            })}
        </ul>
    )
}



export default class Popular extends React.Component{

    constructor(props){
        super(props)

        this.state = {
            selectedLangauge: 'All',
            repos: {},
            error: null
        }

        this.updateLanguage = this.updateLanguage.bind(this)
        this.isLoading = this.isLoading.bind(this)
    }

    componentDidMount() {
        this.updateLanguage(this.state.selectedLangauge)
    }

    updateLanguage(selectedLangauge){
        this.setState({
            selectedLangauge,
            error: null
        })

        if(!this.state.repos[selectedLangauge]){
            fetchPopularRepos(selectedLangauge)
            .then((data) =>{
                this.setState(({repos}) => ({
                    repos: {
                        ...repos,
                        [selectedLangauge]: data
                    }
                }))
            })
            .catch((error) => {
                console.warn("Error: ", error)
    
                this.setState({
                    error: 'Error fetching'
                })
            })
            
        }
    }

    isLoading(){
        const {selectedLangauge, repos, error} = this.state

        return !repos[selectedLangauge] && error === null
    }

    render(){
        const { selectedLangauge, repos, error } = this.state

        return(
            <React.Fragment>
                <LanguageNav 
                    selected = {selectedLangauge}
                    onUpdateLanguage ={this.updateLanguage}
                />

                {this.isLoading() && <p>LOADING</p>}

                {error && <p>{error}</p>}

                {repos[selectedLangauge] && <ReposGrid repos={repos[selectedLangauge]}/>}
            </React.Fragment>
        )
    }
}