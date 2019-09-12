import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';


class SimplePaginate extends Component {
    render() {
        const { totalPages, page, handlePageClick } = this.props;
        return (
            <div className="Pagination">
                <Button 
                    size="mini"
                    disabled={page <= 1}
                    onClick={() => handlePageClick('prev')}
                    >&larr;</Button>
                <span style={{ margin: '10px' }}>
                Page <b>{page}</b> - <b>{totalPages}</b>
                </span>
                <Button
                    size="mini"
                    disabled={page === totalPages}
                    onClick={() => handlePageClick('next')}
                    >&rarr;</Button>
            </div>
        )
    }
}
SimplePaginate.propTypes = {
    totalPages: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    handlePageClick: PropTypes.func.isRequired,
}

export default SimplePaginate;