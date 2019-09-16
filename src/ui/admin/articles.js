import React from 'react';
import { LayoutUser, MainMenu } from '../../layout';

class Articles extends React.Component {
    render = () => {
        return (
            <LayoutUser>
                <MainMenu history={this.props.history} />
                
            </LayoutUser>
        )
    }
}