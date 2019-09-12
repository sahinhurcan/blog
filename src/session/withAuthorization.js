import React from 'react';
import { withRouter } from 'react-router-dom';

import { firebase } from '../firebase';
import { LOGIN_ROUTE } from '../settings';

const withAuthorization = (needsAuthorization) => (Component) => {
    class WithAuthorization extends React.Component {
        // constructor(props){
        //     super(props);
        // }
        componentDidMount() {
            const { history } = this.props;
            firebase.auth.onAuthStateChanged(authUser => {
                if(!authUser && needsAuthorization) {
                    history.push(LOGIN_ROUTE);
                }
            });
        }
        render = () => (
            <Component {...this.props} />
        )
    }
    return withRouter(WithAuthorization);
}

export default withAuthorization;