import React from 'react';

export default class PreviewVisualComponents extends React.Component {

    constructor(props) {
        super(props);
        this.goBack = this.goBack.bind(this);
    }

    goBack() {
        let path = `arrange`;
        this.props.history.push(path);
    }

    render() {
        return(
            <div>
                <h1> preview </h1>
            </div>
        );
    }
}
