import React from 'react';
import { Icon, Card } from 'semantic-ui-react';

import { db } from '../../../firebase';
import { LayoutGuest, PublicMenu, fromObjectToList, DisplayTimeAgo } from '../../../layout';

const treeName = "articles";

class ArticleDetail extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data: null
        }
    }
    getData = async () => {
        let qref = await db.ref(treeName).orderByChild('slug').equalTo(this.props.match.params.slug)
        const snapshot = await qref.once('value');
        this.setState({data: fromObjectToList(snapshot.val())[0]});
    }
    componentDidMount(){
        this.getData();
    }
    render = () => {
        const { data } = this.state
        return (
            <LayoutGuest>
                <PublicMenu history={this.props.history} />
                <Card.Group>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{!!data && data.title}</Card.Header>
                            <Card.Meta>{!!data && data.author} | {!!data && <DisplayTimeAgo time={data.date} isTimeAgo={true} />}</Card.Meta>
                            <Card.Description>
                                {!!data && data.desc}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </LayoutGuest>
        )
    }
}

export default ArticleDetail;