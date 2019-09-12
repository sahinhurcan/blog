import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import { compose } from 'recompose';

import { withAuthentication, withAuthorization } from '../session';
import Head from './head';

//const mapStateToProps = state => ({authUser: state.sessionState.authUser});

const Layout = props => (
    <Fragment>
        {!!props.title && <Head title={props.title} />}
        <Container>
            {props.children}
        </Container>
    </Fragment>
)

export const LayoutGuest = compose(
    withAuthentication,
    withAuthorization(false)
)(Layout);

export const LayoutUser = compose(
    withAuthentication,
    withAuthorization(true)
)(Layout);