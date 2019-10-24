import React from 'react';
import { Card } from 'semantic-ui-react';
import { Remarkable } from 'remarkable';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-gist.css';
//import 'highlight.js/styles/github.css';

import { db } from '../../../firebase';
import { LayoutGuest, PublicMenu, fromObjectToList, DisplayTimeAgo } from '../../../layout';

const treeName = "articles";

let md = new Remarkable('full', {
    html: true,
    typographer: true,
    langPrefix:   'language-',
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return hljs.highlight(lang, str).value;
            } catch (err) {}
        }
        try {
            return hljs.highlightAuto(str).value;
        } catch (err) {}
        return ''; // use external default escaping
    }
});

md.renderer.rules.table_open = () => {
    return '<table class="ui table">';
};
/* 
Inject line numbers for sync scroll. Notes:
 - We track only headings and paragraphs on first level. That's enougth.
 - Footnotes content causes jumps. Level limit filter it automatically.
*/
// md.renderer.rules.paragraph_open = function (tokens, idx) {
//     let line;
//     if (tokens[idx].lines && tokens[idx].level === 0) {
//         line = tokens[idx].lines[0];
//         return '<p class="line" data-line="' + line + '">';
//     }
//     return '<p>';
// };
// md.renderer.rules.heading_open = function (tokens, idx) {
//     let line;
//     if (tokens[idx].lines && tokens[idx].level === 0) {
//         line = tokens[idx].lines[0];
//         return '<h' + tokens[idx].hLevel + ' class="line" data-line="' + line + '">';
//     }
//     return '<h' + tokens[idx].hLevel + '>';
// };

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
                <style>
                    {`
                    p > code {
                        background-color:#f6f8fa;
                    }
                    pre {
                        /*font-size: 85%;*/
                        border-radius:0.3rem; 
                        background-color:#f6f8fa;
                        padding: 4px;
                        overflow: auto;
                        line-height: 1.45;
                    }`}
                </style>
                <PublicMenu history={this.props.history} />
                <Card.Group>
                    <Card fluid>
                        <Card.Content>
                            <Card.Header>{!!data && data.title}</Card.Header>
                            <Card.Meta>{!!data && data.author} | {!!data && <DisplayTimeAgo time={data.date} isTimeAgo={true} />}</Card.Meta>
                            <Card.Description>
                                {!!data && <div dangerouslySetInnerHTML={{__html: md.render(data.desc)}} />}
                            </Card.Description>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </LayoutGuest>
        )
    }
}

export default ArticleDetail;