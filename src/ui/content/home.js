import React from 'react';
import { Icon, Card } from 'semantic-ui-react';

import { db } from '../../firebase';
import { LayoutGuest, PublicMenu, truncate, fromObjectToList, SimplePaginate } from '../../layout';

const treeName = "articles";

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
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            currentPage: 1,
            perPage: 20,
            totalItemCount: 1,
            datalistStack:[],
            datalist: [],
            searchFilter: "",
        }
    }
    getDatalistCount = async () => await db.ref(treeName).once("value", snapshot => this.setState({totalItemCount: snapshot.numChildren()}))
    getDatalist = async (queryDict={}) => {
        const { currentPage, perPage, datalistStack } = this.state;
        const startAt = currentPage * perPage - perPage;
        const direction = queryDict.hasOwnProperty("direction")?queryDict.direction: 'next';
        const searchFilter = queryDict.hasOwnProperty("searchFilter")?queryDict.searchFilter:'';
        let qref = db.ref(treeName)
        let datalist;
        if (direction === 'next') {
            if (startAt > 0) {
                const lastObj = this.state.datalist[this.state.datalist.length - 1];
                qref = qref.startAt(lastObj.articleId);
            }
            if (datalistStack.hasOwnProperty(this.currentPage)) {
                datalist = datalistStack[currentPage - 1];
            } else {
                qref = qref.orderByKey().limitToFirst(perPage + 1);
                const snapshot = await qref.once("value")
                datalist = fromObjectToList(snapshot.val())
                datalistStack.push(datalist);
            }
        } else if (direction === 'prev') {
            datalist = datalistStack[currentPage - 1]
        }
        if (datalist === null) {datalist = []}
        this.setState({datalist, searchFilter});
    }
    getDatalistRefresh = () => {
        this._isMounted && this.setState({datalistStack: []}, async () => {
            await this.getDatalistCount();
            await this.getDatalist();
        })
    }
    getDatalistPartial(){
        let { datalist, perPage } = this.state;
        if (datalist.length === perPage + 1) {datalist = datalist.slice(0, -1)}
        return datalist;
    }
    handlePageClick = direction => {
        const nextPage = direction === 'next' ? this.state.currentPage + 1 : this.state.currentPage - 1;
        this.setState({currentPage: nextPage}, async () => {
            await this.getDatalist({direction});
        });
    }
    componentWillUnmount(){this._isMounted = false;}
    componentDidMount(){
        this._isMounted = true; this.getDatalistRefresh();
    }

    render = () => {
        const { datalist } = this.state;
        return (
            <LayoutGuest>
                <PublicMenu history={this.props.history} />
                <h3>Welcome Back!</h3>
                <Card.Group>
                    {datalist.length > 0 ? datalist.map((val, key) => 
                        <ArticleWidget 
                            // title={val.title}
                            // slug={val.slug}
                            // author={val.author}
                            // desc={val.desc}
                            // date={val.date}
                            {...val}
                            history={this.props.history}
                        />
                    ): <ArticleWidgetEmpty />}
                </Card.Group>
                <br />
                <SimplePaginate 
                    page={this.state.currentPage}
                    totalPages={Math.ceil(this.state.totalItemCount / this.state.perPage)}
                    handlePageClick={this.handlePageClick}
                />
            </LayoutGuest>
        )
    }
}

export default Home;