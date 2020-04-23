import '../../pages.css';

import { faQuestion } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Grid from '@material-ui/core/Grid';
import axios from 'axios';
import React from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { Editors } from 'react-data-grid-addons';

import Settings from './settings';

require('dotenv').config();
const { DropDownEditor } = Editors;


class SetComponents extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            info: [],
            dynamicColumnsComponents: [],
            callbackColumnsComponents: [],
            callbackColumnsDecisionCards: [],
        };

        this.onInfoButtonClicked = this.onInfoButtonClicked.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.onPageChangeButtonClicked = this.onPageChangeButtonClicked.bind(this);
    }

    componentDidMount() {
        this.getSettingsInfo();
        this.getModelsAndCreateDynamicDataGridColumns();
        this.getCallbacksAndCreateDynamicDataGridColumns();
    }

    /**
     * get model list from backend and create dropdown editor for data grid rows
     *
     * @returns {Promise<void>}
     */
    async getModelsAndCreateDynamicDataGridColumns() {
        await axios.get(process.env.REACT_APP_GET_MODELS).then(response => {
            this.setState({models: response.data});
            let j = 1;
            let models = [];
            // map through all models in the response. put them in the form e.g. {id: "model1", value:"Energy"}
            // and put them in a list [{id: "model1", value:"Energy"}, {...}, ...]
            response.data.forEach(item => {
                models.push({id: "model"+j, value: item})
            });
            // create dropdown editor for data grid
            let dropdownEditor = <DropDownEditor options={models}/>;

            this.setState({dynamicColumnsComponents: [
                    {key: "parameter", name: "Parameter"},
                    {key: "type", name: "Type"},
                    {key: "value", name: "Value", editor: dropdownEditor}]});
        });
    }

    /**
     * get callback list from backend and create dropdown editor for data grid rows
     *
     * @returns {Promise<void>}
     */
    async getCallbacksAndCreateDynamicDataGridColumns() {
        await axios.get(process.env.REACT_APP_GET_CALLBACK).then(response => {
            this.setState({models: response.data});
            let j = 1;
            let callback = [];
            // map through all models in the response. put them in the form e.g. {id: "model1", value:"Energy"}
            // and put them in a list [{id: "model1", value:"Energy"}, {...}, ...]
            response.data.forEach(item => {
                callback.push({id: "callback"+j, value: item})
            });
            // create dropdown editor for data grid
            let dropdownEditor = <DropDownEditor options={callback}/>;

            this.setState({callbackColumnsComponents: [
                    {key: "parameter", name: "Parameter"},
                    {key: "type", name: "Type"},
                    {key: "value", name: "Value", editor: dropdownEditor}],
                callbackColumnsDecisionCards: [
                    {key: "parameter", name: "Parameter"},
                    {key: "type", name: "Type"},
                    {key: "value", name: "Value", editor: dropdownEditor}]});
        });
    }

    /**
     * get all information needed, to build the settings page
     *
     * @returns {Promise<void>} Json object with all needed info
     */
    async getSettingsInfo() {
        await axios.get(process.env.REACT_APP_SETTINGS_INFO, {headers: {'Content-Type': 'application/json'}}).then(response => {
            this.setState({info: response.data.input});
            if (localStorage.getItem("apiResponse") && response.data.input.components && response.data.input.decisionCards) {
                const prevResponse = JSON.parse(localStorage.getItem("apiResponse"));
                // check if api response differs from last response. If so, clear local storage, so that new
                // settings can be made
                if (JSON.stringify(prevResponse) !== JSON.stringify(response.data.input)) {
                    localStorage.clear();
                    localStorage.setItem("apiResponse", JSON.stringify(response.data.input));
                    // make a new entry for the final output after erasing everything
                    localStorage.setItem("fullComponentsInfo", JSON.stringify({configuration:{1:{components:[], decisionCards:[]}}}));

                    // fill final output with infos
                    const components = response.data.input.components;
                    const decisionCards = response.data.input.decisionCards;
                    let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                    components.forEach(v => {
                        let currComp = {
                            "name": v,
                            "parameter":[],
                            "position": {},
                            "enabled": false,
                            "toolbox": false
                        };
                        try {
                            finalOutput.configuration['1'].components.push(currComp);
                        }
                        catch (e) {}
                    });
                    decisionCards.forEach(v => {
                        let currDc = {
                            "name": v,
                            "parameter": [],
                            "enabled": false
                        };
                        try {
                            finalOutput.configuration['1'].decisionCards.push(currDc);
                        }
                        catch (e) {}
                    });
                    localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput))
                }
            }
            else if (response.data.input.components && response.data.input.decisionCards) {
                localStorage.setItem("apiResponse", JSON.stringify(response.data.input));
                // fill final output with infos
                const components = response.data.input.components;
                const decisionCards = response.data.input.decisionCards;
                let finalOutput = JSON.parse(localStorage.getItem("fullComponentsInfo"));
                components.forEach(v => {
                    let currComp = {
                        "name": v,
                        "parameter":[],
                        "position": {},
                        "enabled": false,
                        "toolbox": false
                    };
                    try {
                        finalOutput.configuration['1'].components.push(currComp);
                    }
                    catch (e) {}
                });
                decisionCards.forEach(v => {
                    let currDc = {
                        "name": v,
                        "parameter": [],
                        "enabled": false
                    };
                    try {
                        finalOutput.configuration['1'].decisionCards.push(currDc);
                    }
                    catch (e) {}
                });
                localStorage.setItem("fullComponentsInfo", JSON.stringify(finalOutput))
            }
        });
    }

    /**
     * check if given json is contained in array
     *
     * @param array
     * @param json
     * @returns {boolean}
     */
    isJsonInArray(array, json) {
        let result = false;
        array.forEach(v => {
            if (JSON.stringify(v) === JSON.stringify(json)) {
                result = true;
            }
        });
        return result;
    }

    showMessage = (title, message) => {
        confirmAlert({
            title: title,
            message: message,
            buttons: [
                {
                    label: 'Ok',
                }
            ]
        });
    };

    onInfoButtonClicked() {
        this.showMessage("Info Box",
            "On this page, you can decide which components you want to include in your configurations. " +
            "On the 'Visual Components' section, you can tick the components you would like to use. Next, " +
            "on the 'Selected' selection bar, you can decide which of your selected components you would " +
            "like to modify. Last but not least, the data grid on your right hand side will show you all " +
            "parameters of your selected component. The Type row indicates the input type of the parameter " +
            "and by clicking on the Value row of each parameter, you can edit it's value.");
    }

    onPageChangeButtonClicked() {
        let path = `/arrange`;
        this.props.history.push(path);
    }

    render () {
        const info = this.state.info;

        if (info.length === 0) {
            return <span>Loading data...</span>
        }
        return (
            <div>
                <h1>Set Visual Components</h1>
                <div>&nbsp;</div>
                <Grid container spacing={1}>
                    <Grid item xs={6}>
                        <button className="configuration-button" onClick={this.onPageChangeButtonClicked}>Go to 'Arrange Visual Components' page</button>
                    </Grid>
                    <Grid item xs={6}>
                        {/*<div style={{ display: "flex" }}>*/}
                        <button className="configuration-button" onClick={this.onInfoButtonClicked} style={{ marginLeft: "95%", marginBottom: "10px"}}><FontAwesomeIcon icon={faQuestion}/></button>
                        {/*</div>*/}
                    </Grid>
                </Grid>
                <Settings
                    settingsInfo={this.state.info}
                    dynamicColumnsComponents={this.state.dynamicColumnsComponents}
                    callbackColumnsComponents={this.state.callbackColumnsComponents}
                    callbackColumnsDecisionCards={this.state.callbackColumnsDecisionCards}
                />
            </div>);
    }
}

export default SetComponents;