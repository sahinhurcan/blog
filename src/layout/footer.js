import React from 'react';

class Footer extends React.Component {
    render = () => {
        return (
            <footer style={{ height: '70px', textAlign: 'center', padding: '20px 0', margin: '20px 0 0', color: '#010e28' }}>
                <p>&copy; {new Date().getFullYear()} Copyright Crypto Indicator Alerts</p>
            </footer>
        )
    }
}

export default Footer;