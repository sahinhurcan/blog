import React from 'react';
import { Icon, Card } from 'semantic-ui-react';

import { LayoutGuest, PublicMenu, truncate } from '../../layout';

class ArticleWidget extends React.Component {
    render = () => {
        const { title, slug, author, desc, date, history } = this.props;
        return (
            <Card onClick={() => history.push(`/${slug}`) }>
                <Card.Content>
                    <Card.Header>{title}</Card.Header>
                    <Card.Meta>{author} | {date}</Card.Meta>
                    <Card.Description>{truncate(desc, 100)}</Card.Description>
                </Card.Content>
            </Card>
        )
    }
}

const ArticleWidgetEmpty = () => 
    <Card fluid>
        <Card.Header style={{ padding: '24px', textAlign: 'center', fontSize: '20px' }}>
            <Icon name="write" size='large' /><br />
            <p style={{ paddingTop: '8px' }}>There is no article</p>
        </Card.Header>
    </Card>

class Home extends React.Component {
    _isMounted = false;
    constructor(props){
        super(props);
        this.state = {
            articles: []
        }
    }

    render = () => {
        const { articles } = this.state;
        return (
            <LayoutGuest>
                <PublicMenu history={this.props.history} />
                <h3>Welcome Back!</h3>
                <Card.Group>
                    {articles.length > 0 ? articles.map((val, key) => 
                        <ArticleWidget 
                            title={val.title}
                            slug={val.slug}
                            author={val.author}
                            desc={val.desc}
                            date={val.date}
                            history={this.props.history}
                        />
                    ): <ArticleWidgetEmpty />}
                </Card.Group>
            </LayoutGuest>
        )
    }
}

export default Home;