// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import {ScrollView} from 'react-native';

import {makeStyleSheetFromTheme} from 'app/utils/theme';

import StatusBar from 'app/components/status_bar';

import DialogElement from './dialog_element.js';

export default class InteractiveDialog extends PureComponent {
    static propTypes = {
        url: PropTypes.string.isRequired,
        callbackId: PropTypes.string,
        elements: PropTypes.arrayOf(PropTypes.object).isRequired,
        title: PropTypes.string.isRequired,
        submitLabel: PropTypes.string,
        notifyOnCancel: PropTypes.bool,
        state: PropTypes.string,
        navigator: PropTypes.object,
        theme: PropTypes.object,
        actions: PropTypes.shape({
            submitInteractiveDialog: PropTypes.func.isRequired,
        }).isRequired,
    };

    static contextTypes = {
        intl: intlShape.isRequired,
    };

    constructor(props) {
        super(props);

        const values = {};
        props.elements.forEach((e) => {
            values[e.name] = e.default || null;
        });

        this.state = {
            values,
            errors: {},
            submitting: false,
        };
    }

    handleSubmit = () => {

    }

    handleHide = () => {

    }

    onChange = (name, value) => {
        console.log(name + ': ' + value);
        const values = {...this.state.values, [name]: value};
        this.setState({values});
    }

    render() {
        const {elements, theme, navigator} = this.props;
        const style = getStyleFromTheme(theme);

        return (
            <ScrollView style={style.container}>
                <StatusBar/>
                {elements.map((e) => {
                    return (
                        <DialogElement
                            key={'dialogelement' + e.name}
                            displayName={e.display_name}
                            name={e.name}
                            type={e.type}
                            subtype={e.subtype}
                            helpText={e.help_text}
                            errorText={this.state.errors[e.name]}
                            placeholder={e.placeholder}
                            minLength={e.min_length}
                            maxLength={e.max_length}
                            dataSource={e.data_source}
                            optional={e.optional}
                            options={e.options}
                            value={this.state.values[e.name]}
                            onChange={this.onChange}
                            navigator={navigator}
                            theme={theme}
                        />
                    );
                })}
            </ScrollView>
        );
    }
}

const getStyleFromTheme = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            backgroundColor: theme.centerChannelBg,
            marginBottom: 20,
        },
    };
});