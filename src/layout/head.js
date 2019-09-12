import React from 'react';
import { HeadProvider, Title } from 'react-head'; // , Link, Meta
import PropTypes from 'prop-types';

class Head extends React.Component {
    render() {
        const { title } = this.props;
        return (
            <HeadProvider>
                <meta charSet="UTF-8" />
                <Title>{!!title && title}</Title>
            </HeadProvider>
        )
    }
}

Head.propTypes = {
    title: PropTypes.string,
}

export default Head;