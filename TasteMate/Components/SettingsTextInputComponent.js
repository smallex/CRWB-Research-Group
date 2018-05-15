import React from "react";
import styles from "../styles";
import {brandBackground, brandContrast, brandLight, iconSizeStandard} from "../constants/Constants";
import {TextInput, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export class SettingsTextInputComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={{flexDirection: 'row'}}>
                <View style={[styles.containerPadding, styles.leftRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center'}]}>
                    <FontAwesome name={this.props.icon} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                </View>
                <View style={[styles.containerPadding, styles.rightRoundedEdges, {flex: 6, backgroundColor: brandBackground}]}>
                    <TextInput style={[styles.textStandardDark, styles.containerPadding, {backgroundColor: 'transparent', flex: 1}]}
                               placeholder={this.props.placeholder}
                               value={this.props.value}
                               placeholderTextColor={brandLight}
                               returnKeyType={'done'}
                               keyboardType={this.props.keyboardType}
                               clearButtonMode={'while-editing'}
                               underlineColorAndroid={brandBackground}
                               selectionColor={brandContrast}
                               secureTextEntry={this.props.secureTextEntry}
                               onChangeText={this.props.onChangeText}
                    />
                </View>
            </View>
        );
    }
}