import React, { Component } from 'react';
import {Form, Grid, Input, Button, Segment, Message}  from 'semantic-ui-react';

import { LayoutGuest } from '../../layout';
import { auth, fs } from '../../firebase';
import { HOME_ROUTE } from '../../settings';

const INITIAL_STATE = {email: "", password: "", loading: false, error: null};

export default class Login extends Component {
    abortController = new AbortController();
    constructor(props){
        super(props);
        this.state = {...INITIAL_STATE};
    }
    handleSubmit = async e => {
        const { email, password } = this.state;
        const { history } = this.props;
        e.preventDefault();
        this.setState({loading: true, error: ''});
        await auth.doSignInWithEmailAndPassword(email, password)
        .then(async (data) => {
            const { user } = data;
            const ref = fs.collection("admins").doc(user.uid);
            const snapshot = await ref.get();
            const admin = snapshot.data();
            if(admin.admin === true){
                history.push(HOME_ROUTE);
            } else {
                this.setState({error: "User does not has permission to login"});
                await auth.doSignOut();
            }
        }).catch(error => {
            this.setState({error: error.message});
        });
        this.setState({loading: false});
    }
    componentWillUnmount(){
        this.abortController.abort();
    }
    render = () => {
        const { email, password, error } = this.state;
        const isInvalid = password === '' || email === '';
        return (
            <LayoutGuest>
                <div className="login-form">
                    <Grid textAlign="center" style={{ height: '100%' }} verticalAlign="middle">
                        <Grid.Column style={{ maxWidth: '450px', marginTop: '15%' }}>
                            <Form onSubmit={this.handleSubmit} error={!!this.state.error}>
                                <Segment piled>
                                    {!!error && <Message error header="Error!" content={error} />}
                                    <Form.Field>
                                        <label style={{ float: 'left' }}>Email Address</label>
                                        <Input 
                                            type="text"
                                            icon="user"
                                            iconPosition="left"
                                            value={email}
                                            onChange={e => this.setState({email: e.target.value})}
                                            placeholder={"Email Address"}
                                        />
                                    </Form.Field>
                                    <Form.Field>
                                        <label style={{ float: 'left' }}>Password</label>
                                        <Input 
                                            type="password"
                                            icon="lock"
                                            iconPosition="left"
                                            value={this.state.password}
                                            onChange={e => this.setState({password: e.target.value})}
                                            placeholder={"Password"}
                                        />
                                    </Form.Field>
                                    <Button loading={this.state.loading} disabled={isInvalid} primary fluid>Login</Button>
                                </Segment>
                            </Form>
                            <br />

                        </Grid.Column>
                    </Grid>
                </div>
            </LayoutGuest>
        )
    }
}

export const Logout = () => (
    <span  onClick={e => auth.doSignOut()}>Logout</span>
)