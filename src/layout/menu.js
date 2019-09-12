import React from 'react';
import { Menu } from 'semantic-ui-react';

import { auth } from '../firebase';

class MainMenu extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            activeItem: this.props.activeItem || false,
        }
    }
    handleItemClick = (e, {name}) => {
        this.setState({activeItem: name});
        this.props.history.push(`/${name}/`);
    }
    render() {
        const { activeItem } = this.state;
        return (
            <Menu style={{marginTop: '10px'}} pointing secondary>
                <Menu.Item header name="home" onClick={this.handleItemClick}>Crypto Indicator Alerts</Menu.Item>
                <Menu.Item
                    name="alarms"
                    active={activeItem === 'alarms'}
                    onClick={this.handleItemClick}
                    >Alarm</Menu.Item>
                <Menu.Item
                    name="coins"
                    active={activeItem === 'coins'}
                    onClick={this.handleItemClick}
                    >Coin</Menu.Item>
                <Menu.Item
                    name="crons"
                    active={activeItem === 'crons'}
                    onClick={this.handleItemClick}
                    >Crons</Menu.Item>
                <Menu.Item
                    name="indicators"
                    active={activeItem === 'indicators'}
                    onClick={this.handleItemClick}
                    >Indicator</Menu.Item>
                {/* <Menu.Item
                    name="notifications"
                    active={activeItem === 'notifications'}
                    onClick={this.handleItemClick}
                    >Notification</Menu.Item> */}
                <Menu.Item
                    name="orders"
                    active={activeItem === 'orders'}
                    onClick={this.handleItemClick}
                    >Orders</Menu.Item>
                <Menu.Item
                    name="users"
                    active={activeItem === 'users'}
                    onClick={this.handleItemClick}
                    >Users</Menu.Item>
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