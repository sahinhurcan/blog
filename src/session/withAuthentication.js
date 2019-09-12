import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

//import { HOME_ROUTE } from '../settings';
import { firebase } from '../firebase';

const withAuthentication = (Component) => {
    class WithAuthentication extends React.Component {
        componentDidMount() {
            //const { onSetAuthUser, history } = this.props;
            const { onSetAuthUser } = this.props;
            firebase.auth.onAuthStateChanged(authUser => {
                if(authUser){
                    onSetAuthUser(authUser);
                    //history.push(HOME_ROUTE);
                    //console.log(history)
                    //window.location.reload();
                } else {
                    onSetAuthUser(null);
                }
            });
        }
        render = () => (
            <Component { ...this.props } />
        )
    }

    const mapDispatchToProps = ( dispatch) => ({
        onSetAuthUser: authUser => dispatch({type: 'AUTH_USER_SET', authUser}),
    });
    return withRouter(connect(null, mapDispatchToProps)(WithAuthentication));
}

export default withAuthentication;