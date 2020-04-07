import '../../pages.css';

import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';

import SettingsComponents from './settings_components';
import SettingsDecisionCards from './settings_decision_cards';

require('dotenv').config();

class Settings extends React.Component {

    constructor(props) {
        super(props);

        //initialize layout and toolbox
        if (localStorage.getItem('SelectedLayout')){}
        else {localStorage.setItem('SelectedLayout', JSON.stringify({lg: []}));}
        if (localStorage.getItem('toolbox')){}
        else {localStorage.setItem('toolbox', JSON.stringify({lg: []}));}

        //initialize final output and current stats
        let finalComponentsInfo;
        let currentStats;
        let currentStatsDc;
        if (localStorage.getItem("currentStats")) {currentStats = JSON.parse(localStorage.getItem("currentStats"))}
        else {
            currentStats = {
                currComponentName: "",
                currParameters: [],
                currPosition: {},
                currEnabled: false,
                currToolbox: false
            };
            localStorage.setItem("currentStats", JSON.stringify(currentStats))
        }
        if (localStorage.getItem("currentStatsDc")) {currentStatsDc = JSON.parse(localStorage.getItem("currentStatsDc"))}
        else {
            currentStatsDc = {
                currDcName: "",
                currParameters: [],
                currEnabled: false,
            };
            localStorage.setItem("currentStatsDc", JSON.stringify(currentStatsDc))
        }
        if (localStorage.getItem('fullComponentsInfo')){finalComponentsInfo = JSON.parse(localStorage.getItem('fullComponentsInfo'))}
        else {
            localStorage.setItem('fullComponentsInfo', JSON.stringify({configuration:{'1':{components:[], decisionCards:[]}}}));
            finalComponentsInfo = {}
        }

        this.state = {
            finalComponentsInfo: finalComponentsInfo,

            currComponentName: currentStats.currComponentName,
            currParameters: currentStats.currParameters,
            currPosition: currentStats.currPosition,
            currEnabled: currentStats.currEnabled,
            currToolbox: currentStats.currToolbox,


            models: [],
        };

        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("fullComponentsInfo")) {this.setState({fullComponentsInfo: JSON.parse(localStorage.getItem("fullComponentsInfo"))});}
        if (localStorage.getItem("currentStats")) {this.setState({currentStats: JSON.parse(localStorage.getItem("currentStats"))});}
        if (localStorage.getItem("currentStatsDc")) {this.setState({currentStatsDc: JSON.parse(localStorage.getItem("currentStatsDc"))});}
    }

    render() {
        const stylesCheckbox = {
            overflow:"scroll",
        };

        const stylesGridUpper = {
            background: "lightblue",
            borderRadius: "10px",
            marginTop:"5px",
            marginBottom: "10px"
        };

        const stylesGridLower = {
            background: "lightgray",
            marginTop: "10px",
            marginBottom:"5px",
            borderRadius: "10px",

        };

        return (
            <div className="container">
                <div className="row">
                    <form className="form">
                        <SettingsComponents dynamicColumnsComponents ={this.props.dynamicColumnsComponents} callbackColumnsComponents={this.props.callbackColumnsComponents} stylesGridUpper={stylesGridUpper} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
                        <SettingsDecisionCards callbackColumnsDecisionCards={this.props.callbackColumnsDecisionCards} stylesGridLower={stylesGridLower} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
                    </form>
                </div>
            </div>
        );
    }
}

/*
// dynamic component settings. Can be integrated in rendering return form next to the components settings
<SettingsDecisionCards stylesGridLower={stylesGridLower} stylesCheckbox={stylesCheckbox} settingsInfo={this.props.settingsInfo}/>
 */

/**
 * props description of parameters
 */
const descriptionNameRowShape = PropTypes.shape({
    description: PropTypes.string.isRequired,
    name:PropTypes.string.isRequired,
    rows: PropTypes.arrayOf(PropTypes.shape({
        issueTypes: PropTypes.arrayOf(PropTypes.arrayOf({
            id: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired
        }).isRequired).isRequired,
        parameter: PropTypes.string.isRequired,
        value: PropTypes.string.isRequired
    }).isRequired).isRequired
});

Settings.propTypes = {
    settingsInfo: PropTypes.shape({
        components: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        componentsParameters: PropTypes.arrayOf(descriptionNameRowShape.isRequired).isRequired,
        decisionCards: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
        decisionCardsParameter: PropTypes.arrayOf(descriptionNameRowShape.isRequired).isRequired
    }).isRequired
};

export default withRouter(Settings)