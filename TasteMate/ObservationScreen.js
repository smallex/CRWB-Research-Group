import React from "react";
import {
    ActionSheetIOS,
    FlatList,
    Image,
    Linking,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {brandContrast, brandLight, brandMain} from "./constants/Colors";
import styles from "./styles";
import BottomSheet from 'react-native-bottom-sheet';
import {adjectives, comments} from "./MockupData";

export class ObservationScreen extends React.Component {
    constructor(props) {
        super(props);
        this._onPressMenuButton = this._onPressMenuButton.bind(this);
        this._onPressMenuDetailButton = this._onPressMenuDetailButton.bind(this);
        this._onPressLocationText = this._onPressLocationText.bind(this);
        this.state = {isHidden: true};
    }

    _onPressLikeButton() {
        // TODO: Like action
    }

    _onPressCutleryButton() {
        // TODO: Cutlery action
    }

    _onPressSendButton() {
        // TODO: Send action
    }

    _onPressLocationText() {
        // TODO: Possible maps integration, e.g. using https://github.com/react-community/react-native-maps
        const url =  'https://www.google.com/maps/search/?api=1&query=' + observation.location + '&query_place_id=' + observation.googleMapsId;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                console.log("Don't know how to open URI: " + url);
            }
        });
    }

    _onPressMenuButton() {
        const title = 'Select an action';
        const message = 'What would you like to do with the post \"' + observation.dishname + '\" by ' + observation.userid;
        const options = [
            'Share',
            'Edit',
            'Delete',
            'Cancel',
        ];
        const cancelButtonIndex = 3;
        const destructiveButtonIndex = 2;

        // TODO: Customize ActionSheet depending on is logged in or not
        if (Platform.OS === 'android') {
            BottomSheet.showBottomSheetWithOptions({
                    title: title,
                    message: message,
                    options: options,
                    cancelButtonIndex: cancelButtonIndex,
                    destructiveButtonIndex: destructiveButtonIndex,
                },
                (buttonIndex) => {
                    this._onPressMenuDetailButton(buttonIndex);
                });
        } else if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions({
                    title: title,
                    message: message,
                    options: options,
                    cancelButtonIndex: cancelButtonIndex,
                    destructiveButtonIndex: destructiveButtonIndex,
                },
                (buttonIndex) => {
                    this._onPressMenuDetailButton(buttonIndex);
                });
        }
    }

    _onPressMenuDetailButton(buttonIndex) {
        if (buttonIndex === 0) {
            // TODO: Whati s being shared? Link?
            const subject = 'Share';
            const message = 'Where do you want to share this post?';
            const url = '';
            //var excludedActivityTypes = '';

            if (Platform.OS === 'android') {
                BottomSheet.showShareBottomSheetWithOptions({
                        subject: subject,
                        message: message,
                        url: url,
                    },
                    () => {
                        this._onSuccessfulShare();
                    },
                    () => {
                        this._onUnsuccessfulShare();
                    });
            } else if (Platform.OS === 'ios') {
                ActionSheetIOS.showShareActionSheetWithOptions({
                        subject: subject,
                        message: message,
                        url: url,
                    },
                    () => {
                        this._onSuccessfulShare();
                    },
                    () => {
                        this._onUnsuccessfulShare();
                    });
            }
        } else if (buttonIndex === 1) {
            this.props.nav.navigate('CreateObservation', {item: observation});
        } else if (buttonIndex === 2) {
            // TODO: Delete obs
        }
    }

    _onSuccessfulShare(buttonIndex) {
        // TODO: ??
    }

    _onUnsuccessfulShare(buttonIndex) {
        // TODO: ??
    }

    _toggleOverlay() {
        this.setState(previousState => {
            return { isHidden: !previousState.isHidden };
        });
    }

    render() {
        const SmileysEnum = Object.freeze({1:'😖', 2:'😟', 3:'🙁', 4:'😕', 5:'😶', 6:'🙂', 7:'😊', 8:'😄', 9:'😍'});

        let adjs = '';
        for (let i = 0; i < adjectives.length; i++) {
            adjs = adjs + '#' + adjectives[i].value.adjective + ' ';
        }

        const observation = this.props.observation;

        return (
            <View name={'wrapper'} style={{flex:1}} >
                <View name={'header'} style={{flexDirection:'row'}}>
                    <View name={'header'} style={[styles.containerPadding, {flex: 0, flexDirection:'column'}]}>
                        <Image name={'userprofilepic'} resizeMode={'cover'} source={require('./user2.jpg')} style={styles.roundProfile}/>
                    </View>
                    <View name={'header'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}>
                        <View name={'header'} style={{flex: 1, flexDirection:'row'}}>
                            <Text name={'dishnames'} >
                                <Text name={'dishname'} style={styles.textTitleBold}>{observation.dishname}</Text>
                                <Text name={'mypoc'} style={styles.textTitle}> ({observation.mypoc})</Text>
                            </Text>
                        </View>
                        <Text name={'location'} style={styles.textSmall} onPress={this._onPressLocationText}>{observation.location}</Text>
                    </View>
                    <FontAwesome name={'ellipsis-v'} size={25} color={brandContrast} style={styles.containerPadding} onPress={this._onPressMenuButton}/>
                </View>
                <View name={'picture'} style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={this._toggleOverlay.bind(this)} style={{flex: 1, aspectRatio: 1}}>
                        <Image name={'image'} resizeMode={'contain'} source={require('./carbonara.png')} style={{flex: 1, aspectRatio: 1}}/>
                    </TouchableOpacity>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute'}]}>
                        <Text name={'smiley'} style={styles.textTitleBold}>{SmileysEnum[observation.rating]}</Text>
                    </View>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', right:0, flexWrap:'wrap'}]}>
                        <Text name={'price'} style={styles.textTitleBold}>{observation.currency} {observation.price}</Text>
                    </View>
                    <View style={[styles.containerOpacity, {padding: 6, position: 'absolute', bottom: 0, flexDirection:'row'}]}>
                        <TouchableOpacity style={{paddingRight: 6}} onPress={this._onPressLikeButton}>
                            <FontAwesome name={'thumbs-o-up'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this._onPressCutleryButton}>
                            <FontAwesome name={'cutlery'} size={25} color={brandContrast}/>
                        </TouchableOpacity>
                    </View>
                    {!this.state.isHidden &&
                    <ScrollView style={[styles.containerOpacityDark, {position: 'absolute', top: 0, left: 0, bottom: 0, right: 0}]} contentContainerStyle={{flexGrow: 1}}>
                        <TouchableOpacity name={'adjectivesoverlay'} onPress={this._toggleOverlay.bind(this)} style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={[styles.textTitleBoldLight, styles.containerPadding, {textAlign:'center'}]} adjustsFontSizeToFit={true} allowFontScaling={true}>{adjs} </Text>
                        </TouchableOpacity>
                    </ScrollView>
                    }
                </View>
                <View name={'description'} style={[styles.containerPadding, styles.bottomLine, {flexDirection:'column'}]}>
                    <Text name={'description'} style={styles.textStandard}>{observation.description}</Text>
                    {/*TODO: reformat time, likes & cutleries from e.g. 2001 likes to 2k likes, date to 2 days ago etc*/}
                    <Text name={'details'} style={styles.textSmall}>{observation.time} • {observation.likes} likes • {observation.cutleries} cutleries</Text>
                </View>
                <FlatList name={'comments'} style={[styles.containerPadding, {flex: 1, flexDirection:'column'}]}
                          data={comments}
                          renderItem={({item}) =>
                              <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                                  <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('./user.jpg')} />
                                  <Text style={[styles.textStandard, styles.containerPadding, {flex: 1}]}>{item.value.message}</Text>
                              </View>}
                          ListFooterComponent={() =>
                              <View style={{flex: 1, flexDirection:'row', alignItems: 'center'}}>
                                  <Image name={'userpic'} style={[styles.roundProfileSmall, styles.containerPadding]} resizeMode={'cover'} source={require('./user2.jpg')} />
                                  <TextInput style={[styles.textStandard, styles.containerPadding, {flex: 1}]} placeholder="Write a comment..." placeholderTextColor={brandLight} returnKeyType={'send'} keyboardType={'default'} underlineColorAndroid={brandContrast} selectionColor={brandMain} onSubmitEditing={this._onPressSendButton}/>
                                  <TouchableOpacity onPress={this._onPressSendButton}>
                                      <FontAwesome name={'send'} size={25} color={brandContrast}/>
                                  </TouchableOpacity>
                              </View>
                          }
                />
            </View>
        );
    }
}
//TODO: 3+ comments