import React from 'react';
import axios from 'axios';

import { connect } from 'react-redux';

import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";

// #0
import { setMovies, setUser } from '../../actions/actions';


/*
  #1 Thes rest of components import statements but without the MovieCard's
  because it will be importe and used in the MoviesList component rather
  than in here.
*/

import './main-view.scss';

// we haven't written this one yet
import MoviesList from '../movies-list/movies-list';
import { LoginView } from '../login-view/login-view';
// import { MovieCard } from '../movie-card/movie-card';
import MovieView from '../movie-view/movie-view';
import { DirectorView } from '../director-view/director-view';
import { GenreView } from '../genre-view/genre-view'
import { RegistrationView } from '../registration-view/registration-view';
import ProfileView from '../profile-view/profile-view';
import { NavBar } from '../navbar-view/navbar-view';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// import Button from 'react-bootstrap/Button';

// #2 export keyword removed from here
class MainView extends React.Component {
  
  constructor(){
    super();
  // Initial state is set to null
  // #3 movies state removed from here
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken, localStorage.getItem('user'));
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.props.setUser(authData.user);

    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  getUser(token, username) {
    axios.get(`https://favflix.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => {
      this.props.setUser(response.data);
      console.log(response) 
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  onRegistration(register) {
    this.setState({
      register: register,
    });
  }

  getMovies(token) {
    axios.get('https://favflix.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}`}
    })
    .then(response => {

      // #4
      this.props.setMovies(response.data);
      // Assign the result to the state
      /* this.setState({
        movies: response.data
      });*/
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  render() {

    // #5 movies is extracted from this.props rather than from this.state
    let { movies, user } = this.props;
    console.log('render', user);

    return (
      <Router>
        <NavBar user={user} />

        <Row className="main-view justify-content-md-center">

          <Route exact path="/" render={() => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            // #6
            return <MoviesList movies={movies}/>
            /* return movies.map(m => (
              <Col md={3} key={m._id}>
                <MovieCard movie={m} />
              </Col>
            )) */
          }} />

          <Route exact path="/users" render={() => {
            if (user) return <Redirect to="/" />
            return <Col>
              <RegistrationView />
            </Col>
          }} />

          <Route path="/movies/:movieId" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <MovieView movie={movies.find(m => m._id === match.params.movieId)} onBackClick={() => history.goBack()} />
            </Col>
          }} />

          <Route path="/director/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} onBackClick={() => history.goBack()} />
            </Col>
            }
          } />

          <Route path="/genres/:name" render={({ match, history }) => {
            if (!user) return <Col>
              <LoginView onLoggedIn={user => this.onLoggedIn(user)} />
            </Col>
            if (movies.length === 0) return <div className="main-view" />;
            return <Col md={8}>
              <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} onBackClick={() => history.goBack()} />
            </Col>
            }
          } />

          <Route exact path='/users/:Username' render={({ history}) => {
            if (!user) return <LoginView onLoggedIn={(data) => this.onLoggedIn(data)} />;
            if (movies.length ===0) return;
            return <ProfileView history={history} movies={movies} />
          }} />

        </Row>
      </Router>
      
    );
  }
}

// #7
let mapStateToProps = state => {
  return { movies: state.movies, user: state.user }
}

// #8
export default connect(mapStateToProps, { setMovies, setUser })(MainView);