import React from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import { Provider } from 'react-redux'

import { initStore } from './reducer';
import { Home } from './ui/content';

const history = createBrowserHistory();

function App() {
    return (
        <Provider store={initStore()} history={history} >
            <BrowserRouter>
                <Route path="/" exact component={Home} />
            </BrowserRouter>
        </Provider>
    );
}

export default App;
