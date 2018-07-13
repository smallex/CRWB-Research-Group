import React from "react";
import styles, {standardFontSize} from "../styles";
import {brandBackground, brandContrast, brandLight, brandMain, iconSizeStandard} from "../constants/Constants";
import {Alert, TextInput, TouchableOpacity, View} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";

export class TextInputComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    focus() {
        this.textInput.focus()
    }

    render() {
        return (
            <View style={{flexDirection: 'row', flex: 1, opacity: this.props.hidden ? 0 : 100}}>
                <View style={[styles.containerPadding, styles.leftRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center', justifyContent:'center'}]}>
                    {
                        this.props.fontawesome &&
                        <FontAwesome name={this.props.icon} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                    }
                    {
                        this.props.materialcommunityicons &&
                        <MaterialCommunityIcons name={this.props.icon} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                    }
                    {
                        this.props.entypo &&
                        <Entypo name={this.props.icon} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                    }
                </View>
                <View style={[styles.containerPadding, !this.props.info && !this.props.secondItem && styles.rightRoundedEdges, {flex: this.props.info ? 5 : (this.props.secondItem ? 2 : 6), backgroundColor: brandBackground}, this.props.firstItem && {paddingBottom: 0}]}>
                    {
                        this.props.firstItem &&
                        <View style={[styles.containerPadding, {flex:1}]}>
                            {this.props.firstItem}
                        </View>
                    }
                    {
                        !this.props.firstItem &&
                        <TextInput
                            ref={input => this.textInput = input}
                            style={[styles.textStandardDark, styles.containerPadding, {backgroundColor: 'transparent', flex: 1}]}
                            placeholderTextColor={brandLight}
                            underlineColorAndroid={brandBackground}
                            selectionColor={brandMain}
                            fontSize={standardFontSize}
                            clearButtonMode={'while-editing'}
                            placeholder={this.props.placeholder}
                            value={this.props.value}
                            returnKeyType={this.props.returnKeyType ? this.props.returnKeyType : 'done'}
                            returnKeyLabel={this.props.returnKeyLabel}
                            keyboardType={this.props.keyboardType}
                            secureTextEntry={this.props.secureTextEntry}
                            onChangeText={this.props.onChangeText}
                            multiline={this.props.multiline}
                            onEndEditing={this.props.onEndEditing}
                            onSubmitEditing={this.props.onSubmitEditing}
                            editable={this.props.editable}
                            maxLength={this.props.maxLength}
                        />
                    }
                </View>
                {
                    this.props.info &&
                    <TouchableOpacity onPress={() => Alert.alert(this.props.infoTitle, this.props.infoText, this.props.infoButtons)} style={[styles.containerPadding, styles.rightRoundedEdges, {flex: 1, backgroundColor: brandBackground, alignItems: 'center', justifyContent:'center'}]}>
                        <FontAwesome name={'info'} size={iconSizeStandard} color={brandContrast} style={[styles.containerPadding]}/>
                    </TouchableOpacity>
                }
                {
                    this.props.secondItem &&
                    <View style={[styles.containerPadding, styles.rightRoundedEdges, styles.containerPadding, {paddingBottom:0, flex: 4, backgroundColor: brandBackground}]}>
                        <View style={[styles.containerPadding, {flex:1}]}>
                            {this.props.secondItem}
                        </View>
                    </View>
                }
            </View>
        );
    }
}