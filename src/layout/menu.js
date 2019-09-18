import React from 'react';
import { Menu } from 'semantic-ui-react';

import { auth } from '../firebase';

class MainMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem || false,
            path: '/',
        }
    }
    handleItemClick = (e, {name, path}) => {
        this.setState({activeItem: name});
        this.props.history.push(`/admin${path}`);
    }
    render() {
        const { activeItem } = this.state;
        return (
            <Menu style={{marginTop: '10px'}} pointing secondary>
                <Menu.Item header name="home" path="" onClick={this.handleItemClick}>Blog Administration</Menu.Item>
                <Menu.Item
                    name="articles"
                    path="/articles"
                    active={activeItem === 'articles'}
                    onClick={this.handleItemClick}
                    >Articles</Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item
                        name="logout"
                        active={activeItem === 'logout'}
                        onClick={() => {auth.doSignOut()}}
                        >Logout</Menu.Item>
                </Menu.Menu>
            </Menu>
        )
    }
}
export default MainMenu;

export class PublicMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem || false,
            path: '/',
        }
    }
    handleItemClick = (e, {name, path}) => {
        this.setState({activeItem: name});
        this.props.history.push(`${path}`);
    }
    render = () => {
        return (
            <Menu style={{ marginTop: '10px' }} pointing secondary>
                <Menu.Item header name="home" path="/" onClick={this.handleItemClick}>SuperNovaSoft Blog</Menu.Item>
            </Menu>
        )
    }
}