import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux'

import { initStore } from './reducer';
import { Home, ArticleDetail } from './ui/content';
import { Login } from './ui/auth';

import 'semantic-ui-css/semantic.min.css'
import './App.css'

const history = createBrowserHistory();

const App = () => {
    return (
        <Provider store={initStore()} history={history} >
            <BrowserRouter>
                <Route path="/" exact component={Home} />
                <Route path="/:slug" exact component={ArticleDetail} />
                <Route path="/auth/login" component={Login} />
            </BrowserRouter>
        </Provider>
    );
}

export default App;
