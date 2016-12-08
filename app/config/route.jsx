import React from 'react';
import { hashHistory, Router, Route, IndexRoute, IndexRedirect} from 'react-router';
import Layout from '../components/Layout';
// import {Board} from

export default(
    <Router history={hashHistory}>
        <Route path='/' component={Layout}>
        </Route>
    </Router>
);
