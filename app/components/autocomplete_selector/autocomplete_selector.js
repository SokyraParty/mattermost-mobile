// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React, {PureComponent} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import PropTypes from 'prop-types';
import {intlShape} from 'react-intl';
import Icon from 'react-native-vector-icons/FontAwesome';

import {displayUsername} from 'mattermost-redux/utils/user_utils';

import {preventDoubleTap} from 'app/utils/tap';
import {makeStyleSheetFromTheme, changeOpacity} from 'app/utils/theme';
import {ViewTypes} from 'app/constants';

export default class AutocompleteSelector extends PureComponent {
    static propTypes = {
        actions: PropTypes.shape({
            setAutocompleteSelector: PropTypes.func.isRequired,
        }).isRequired,
        label: PropTypes.string,
        placeholder: PropTypes.string.isRequired,
        dataSource: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.object),
        selected: PropTypes.object,
        teammateNameDisplay: PropTypes.string,
        theme: PropTypes.object.isRequired,
        navigator: PropTypes.object,
        onSelected: PropTypes.func,
    };

    static contextTypes = {
        intl: intlShape,
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedText: null,
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selected && props.selected !== state.selected) {
            return {
                selectedText: props.selected.text,
                selected: props.selected,
            };
        }

        return null;
    }

    handleSelect = (selected) => {
        if (!selected) {
            return;
        }

        const {
            dataSource,
            teammateNameDisplay,
        } = this.props;

        let selectedText;
        let selectedValue;
        if (dataSource === ViewTypes.DATA_SOURCE_USERS) {
            selectedText = displayUsername(selected, teammateNameDisplay);
            selectedValue = selected.id;
        } else if (dataSource === ViewTypes.DATA_SOURCE_CHANNELS) {
            selectedText = selected.display_name;
            selectedValue = selected.id;
        } else {
            selectedText = selected.text;
            selectedValue = selected.value;
        }

        this.setState({selectedText});

        if (this.props.onSelected) {
            this.props.onSelected({text: selectedText, value: selectedValue});
        }
    };

    goToSelectorScreen = preventDoubleTap(() => {
        const {formatMessage} = this.context.intl;
        const {navigator, theme, actions, dataSource, options, placeholder} = this.props;

        actions.setAutocompleteSelector(dataSource, this.handleSelect, options);

        navigator.push({
            backButtonTitle: '',
            screen: 'MenuActionSelector',
            title: placeholder || formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'}),
            animated: true,
            navigatorStyle: {
                navBarTextColor: theme.sidebarHeaderTextColor,
                navBarBackgroundColor: theme.sidebarHeaderBg,
                navBarButtonColor: theme.sidebarHeaderTextColor,
                screenBackgroundColor: theme.centerChannelBg,
            },
        });
    });

    render() {
        const {intl} = this.context;
        const {
            placeholder,
            theme,
            label,
        } = this.props;
        const {selectedText} = this.state;
        const style = getStyleSheet(theme);

        let text = placeholder || intl.formatMessage({id: 'mobile.action_menu.select', defaultMessage: 'Select an option'});
        let selectedStyle = style.dropdownPlaceholder;

        if (selectedText) {
            text = selectedText;
            selectedStyle = style.dropdownSelected;
        }

        let labelContent;
        if (label) {
            labelContent = (
                <Text style={style.label}>
                    {label}
                </Text>
            );
        }

        return (
            <View style={style.container}>
                {labelContent}
                <TouchableOpacity
                    style={style.flex}
                    onPress={this.goToSelectorScreen}
                >
                    <View style={style.input}>
                        <Text
                            style={selectedStyle}
                            numberOfLines={1}
                        >
                            {text}
                        </Text>
                        <Icon
                            name='chevron-down'
                            color={changeOpacity(theme.centerChannelColor, 0.5)}
                            style={style.icon}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

const getStyleSheet = makeStyleSheetFromTheme((theme) => {
    return {
        container: {
            width: '100%',
            marginBottom: 2,
            marginRight: 8,
            marginTop: 10,
        },
        input: {
            borderWidth: 1,
            borderRadius: 5,
            borderColor: changeOpacity(theme.centerChannelColor, 0.1),
            backgroundColor: changeOpacity(theme.centerChannelBg, 0.9),
            paddingLeft: 10,
            paddingRight: 30,
            paddingVertical: 7,
            height: 33,
        },
        dropdownPlaceholder: {
            color: changeOpacity(theme.centerChannelColor, 0.5),
        },
        dropdownSelected: {
            color: theme.centerChannelColor,
        },
        icon: {
            position: 'absolute',
            top: 10,
            right: 12,
        },
        label: {
            fontSize: 14,
            color: theme.centerChannelColor,
            marginLeft: 15,
            marginTop: 15,
        },
    };
});
