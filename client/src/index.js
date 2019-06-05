import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'
import './index.css';

import App from './components/App';
import Signin from './components/Auth/Signin';
import Signup from './components/Auth/Signup';
import withSession from './components/withSession';
import Search from './components/Recipe/Search'

import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import NavBar from './components/NavBar';
import AddRecipe from './components/Recipe/AddRecipe';
import Profile from './components/Profile/Profile'

//Essential for connecting frontend and Backend
const client = new ApolloClient({
    uri: 'http://localhost:4444/graphql',
    // Allows sending token to backend
    fetchOptions: {
        credentials: 'include'
    },
    request: operation => {
        const token = localStorage.getItem('token')
        operation.setContext({
            headers: {
                authorization: token
            }
        })
    },
    onError: ({ networkError}) => {
        if (networkError) {
            console.log('Network Error', networkError);
            }
        }
    }
);

const Root =({refetch}) => (
    <Router>
        <Fragment>
            <NavBar/>
            <Switch>
                <Route path="/" exact component={App} />
                <Route path="/search" exact component={Search} />
                <Route path="/signin" render={()=> <Signin refetch={refetch} />} />
                <Route path="/signup" render={()=> <Signup refetch={refetch} />} />
                <Route path="/recipe/add" exact component={AddRecipe} />
                <Route path="/profile" exact component={Profile} />
                <Redirect to="/"/>
             </Switch>
        </Fragment>
    </Router>
);

const RootWithSession = withSession(Root)


ReactDOM.render(
<ApolloProvider client={client}>
    <RootWithSession /> 
</ApolloProvider>, 
document.getElementById('root'));

