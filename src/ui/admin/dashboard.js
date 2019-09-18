import React from 'react';
import { LayoutUser, MainMenu } from '../../layout';

class Dashboard extends React.Component {
    render = () => {
        return (
            <LayoutUser>
                <MainMenu history={this.props.history} />
                Dashboard
            </LayoutUser>
        )
    }
}

export default Dashboard;