import React from 'react';

import { Button, Label, Divider, Modal, Icon, Header, Form, Message, Table } from 'semantic-ui-react';

import { LayoutUser, MainMenu, SimplePaginate, slugify, fromObjectToList, randomString, DisplayTimeAgo } from '../../layout';
import { db } from '../../firebase';

const treeName = "categories";
const INITIAL_STATE = {name: '', active: true, error: '', success: '', loading: false}

class AddDataModal extends React.Component {
    state = {open: false, ...INITIAL_STATE}
    closeConfigShow = (closeOnEscape) => () => {this.setState({closeOnEscape, open: true})}
    close = () => this.setState({open: false})
    handleSubmit = async e => {
        e.preventDefault();
        this.setState({loading: true, error: '', success: ''})
        const categoryId = randomString(28);
        db.ref(treeName).child(categoryId).set({
            name: this.state.name,
            slug: slugify(this.state.name),
            active: true,
            categoryId: categoryId,
            date: Math.floor(Date.now()),
        })
        this.setState({name: '', loading: false, open: false})
        this.props.getDatalistRefresh();
    }
    render = () => {
        const { open, closeOnEscape, name } = this.state;
        const isValid = name !== '';
        return (
            <React.Fragment>
                <Button floated='right' size='mini' color='orange' onClick={this.closeConfigShow(false, true)}><Icon name='plus' />New Category</Button>
                <Modal closeOnEscape={closeOnEscape} onClose={this.close} open={open} size='large'>
                    <Modal.Header>Add New Category</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form onSubmit={this.handleSubmit} error={!!this.state.error}>
                                {!!this.state.error && <Message error visible header="Error!" content={this.state.error} />}
                                {!!this.state.success && <Message error visible header="Success!" content={this.state.success} />}
                                <Form.Field>
                                    <label>Name</label>
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={e => this.setState({name: e.target.value})}
                                        placeholder="Name"
                                    />
                                </Form.Field>
                                <Button loading={this.state.loading} disabled={!isValid} primary>Save</Button>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    }
}

class EditDataModal extends React.Component {
    constructor(props){
        super(props)
        this.state = {open: false, loading: false, error: '', success: '', ...props.dataRow}
    }
    closeConfigShow = (closeOnEscape) => () => {this.setState({closeOnEscape, open: true})}
    close = () => this.setState({open: false})
    handleSubmit = async (e) => {
        e.preventDefault()
        this.setState({loading: true, error: '', success: ''})
        const { categoryId } = this.state;
        db.ref(treeName).child(categoryId).update({
            name: this.state.name,
            slug: slugify(this.state.name),
            categoryId: categoryId,
            date: Math.floor(Date.now()),
        })
        this.setState({loading: false, open: false})
        this.props.getDatalistRefresh();
    }
    render = () => {
        const { name } = this.state; // open, closeOnEscape,
        const isValid = name !== '';
        return (
            <React.Fragment>
                <span onClick={this.closeConfigShow(false, true)} style={{ cursor: 'pointer' }}><Icon name="edit outline" color="blue" /></span>
                <Modal closeOnEscape={this.state.closeOnEscape} onClose={this.close} open={this.state.open} size='large'>
                    <Modal.Header>Edit Category</Modal.Header>
                    <Modal.Content>
                        <Modal.Description>
                            <Form onSubmit={this.handleSubmit} error={!!this.state.error}>
                                {!!this.state.error && <Message error visible header="Error!" content={this.state.error} />}
                                {!!this.state.success && <Message error visible header="Success!" content={this.state.success} />}
                                <Form.Field>
                                    <label>Name</label>
                                    <input 
                                        type="text"
                                        value={name}
                                        onChange={e => this.setState({name: e.target.value})}
                                        placeholder="Name"
                                    />
                                </Form.Field>
                                <Button loading={this.state.loading} disabled={!isValid} primary>Save</Button>
                            </Form>
                        </Modal.Description>
                    </Modal.Content>
                </Modal>
            </React.Fragment>
        )
    }
}

class DataRow extends React.Component {
    state = {open: false}
    closeConfigShow = (closeOnEscape) => () => {this.setState({closeOnEscape, open: true})}
    close = () => this.setState({open: false})
    handleDelete = async categoryId => {
        await db.ref(treeName).child(categoryId).remove();
        this.props.getDatalistRefresh();
    }
    deleteModal = categoryId => {
        const { open, closeOnEscape } = this.state;
        return (
            <React.Fragment>
                <span onClick={this.closeConfigShow(false, true)} style={{ cursor: 'pointer' }}><Icon name='trash alternate outline' color='red' /></span>
                <Modal closeOnEscape={closeOnEscape} onClose={this.close} open={open} basic size='tiny'>
					<Header icon='trash alternate outline' content="Delete Category" />
					<Modal.Content>
						<p>Are you sure to delete this category?</p>
					</Modal.Content>
					<Modal.Actions>
						<Button color='green' onClick={() => this.handleDelete(categoryId)} inverted><Icon name='checkmark' /> Yes</Button>
						<Button basic color='red' onClick={this.close} inverted><Icon name='remove' /> No</Button>
					</Modal.Actions>
				</Modal>
            </React.Fragment>
        )
    }
    render = () => {
        const { Row, Cell } = Table;
        const { name, categoryId, date } = this.props.dataRow;
        return (
            <Row>
                <Cell>{name}</Cell>
                <Cell>{categoryId}</Cell>
                <Cell><DisplayTimeAgo time={date} isTimeAgo={true} /></Cell>
                <Cell>
                    <EditDataModal {...this.props} />
                    {this.deleteModal(categoryId)}
                </Cell>
            </Row>
        )
    }
}

class Categories extends React.Component {
    constructor(props){
        super(props)
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
                qref = qref.startAt(lastObj.categoryId);
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
        const { Header, Row, HeaderCell, Body } = Table;
        const datalist = this.getDatalistPartial();
        return (
            <LayoutUser>
                <MainMenu history={this.props.history} />
                <h3>All Categories <Label floated="right">Total {this.state.totalItemCount}</Label>
                    <AddDataModal getDatalistRefresh={this.getDatalistRefresh} uid={this.props.uid} displayName={this.props.displayName} />
                </h3>
                <Divider />
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>Name</HeaderCell>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Time</HeaderCell>
                            <HeaderCell><Icon name='ellipsis horizontal' /></HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        {datalist.length > 0 && datalist.map((dataRow, key) => 
                            <DataRow key={key} getDatalistRefresh={this.getDatalistRefresh} dataRow={dataRow} />
                        )}
                    </Body>
                </Table>
                <SimplePaginate 
                    page={this.state.currentPage}
                    totalPages={Math.ceil(this.state.totalItemCount / this.state.perPage)}
                    handlePageClick={this.handlePageClick}
                />
            </LayoutUser>
        )
    }
}

export default Categories;