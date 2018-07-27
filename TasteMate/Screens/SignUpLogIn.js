import React from 'react';
import {
    findNodeHandle,
    ImageBackground,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import strings from "../strings";
import styles from "../styles";
import {
    _formatUsername,
    _handleAuthError,
    colorAccent,
    iconEmail,
    iconLocation,
    iconPassword,
    iconUser,
    maxUsernameLength,
    pathUsers,
    tastemateFont
} from "../constants/Constants";
import {TextInputComponent} from "../Components/TextInputComponent";
import firebase from 'react-native-firebase';
import {ActivityIndicatorComponent} from "../Components/ActivityIndicatorComponent";

export class SignUpLogInScreen extends React.Component {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this._onPressSwitch = this._onPressSwitch.bind(this);
        this._onPressSubmit = this._onPressSubmit.bind(this);
        this._onPressSkip = this._onPressSkip.bind(this);
        this._focusNextField = this._focusNextField.bind(this);
        this._onAuthError = this._onAuthError.bind(this);
        this._startActivityIndicator = this._startActivityIndicator.bind(this);
        this._stopActivityIndicator = this._stopActivityIndicator.bind(this);
        this._setActivityIndicatorText = this._setActivityIndicatorText.bind(this);
        this._inputFocused = this._inputFocused.bind(this);

        this.state = {
            username: undefined,
            email: undefined,
            location: undefined,
            password: undefined,
            signUpActive: true,
            error: null,
            user: null,
            loadingIndicatorVisible: false,
            loadingIndicatorText: '',
        };

        this.unsubscriber = null;
        this.skipPressed = false;
        this.inputs = {};
        this.scrollView = null;
    }

    componentDidMount() {
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            this.setState({user: user});
            if (user && (!user.isAnonymous || this.skipPressed)) {
                this._close();
            }
        });
    }

    componentWillMount() {
        StatusBar.setHidden(true);
    }

    componentWillUnmount() {
        StatusBar.setHidden(false);
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onPressSubmit() {
        let _startActivityIndicator = this._startActivityIndicator;
        let _stopActivityIndicator = this._stopActivityIndicator;
        let _setActivityIndicatorText = this._setActivityIndicatorText;
        let _onAuthError = this._onAuthError;

        let errorMessage = '';
        if (!this.state.email) {
            errorMessage = strings.errorMessageEnterEmail;
        } else if (!this.state.password) {
            errorMessage = strings.errorMessageEnterPassword;
        } else {
            if (this.state.signUpActive) {
                if (!this.state.username) {
                    errorMessage = strings.errorMessageEnterUsername;
                } else if (!this.state.location) {
                    errorMessage = strings.errorMessageEnterLocation;
                } else {
                    _startActivityIndicator(strings.checkingUsername);

                    console.log('Checking if username already exists...');
                    const refUsername = firebase.database().ref(pathUsers).orderByChild('username').equalTo(this.state.username);
                    refUsername.once(
                        'value',
                        (dataSnapshot) => {
                            console.log('Username successfully checked');
                            if (dataSnapshot.toJSON()) {
                                // Display error message
                                _stopActivityIndicator();
                                this.setState({error: strings.errorMessageUsernameAlreadyInUse});
                            } else {
                                // Create account
                                _setActivityIndicatorText(strings.creatingAccount);
                                console.log('Creating new account...');
                                firebase.auth().createUserAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password).then((credentials) => {
                                    console.log('Successfully created new account.');

                                    // Add user's username & location to database
                                    _setActivityIndicatorText(strings.savingUserInformation);
                                    firebase.database().ref(pathUsers).child(credentials.user.uid).set({
                                        username: this.state.username,
                                        location: this.state.location.trim(),
                                        userid: credentials.user.uid
                                    }, (error) => {
                                        if (error) {
                                            console.log('Error during user information transmission.');
                                            console.log(error);
                                            _stopActivityIndicator();
                                            _handleAuthError(error, _onAuthError);
                                        } else {
                                            _stopActivityIndicator();
                                            console.log('Successfully added user information to DB.');
                                        }
                                    });
                                }).catch((error) => {
                                    console.log('Error during signup.');
                                    console.log(error);
                                    _stopActivityIndicator();
                                    _handleAuthError(error, _onAuthError);
                                });
                            }
                        },
                        (error) => {
                            _stopActivityIndicator();
                            console.log('Error while checking if username exists');
                            console.log(error);
                        }
                    );
                }
            } else {
                _startActivityIndicator(strings.loggingIn);
                console.log('Logging in...');
                firebase.auth().signInAndRetrieveDataWithEmailAndPassword(this.state.email, this.state.password).then(() => {
                    console.log('Successfully logged in.');
                    _stopActivityIndicator();
                }).catch((error) => {
                    console.log('Error during login.');
                    console.log(error);
                    _stopActivityIndicator();
                    _handleAuthError(error, _onAuthError);
                });
            }
        }

        _onAuthError(errorMessage);
    }

    _onAuthError(errorMessage) {
        this.setState({error: errorMessage});
    }

    _onPressSwitch() {
        this.setState((prevState) => ({signUpActive: !prevState.signUpActive}));
    }

    _onPressSkip() {
        this.skipPressed = true;
        if (this.state.user) {
            this._close();
        } else {
            this._startActivityIndicator(strings.creatingAnonymous);
            firebase.auth().signInAnonymouslyAndRetrieveData().then(() => {
                console.log('Successfully signed up.');
            }).catch((error) => {
                console.log('Error during signup.');
                console.log(error);
                this._stopActivityIndicator();
                this._handleAuthError(error, this._onAuthError);
            });
        }
    }

    _close() {
        this.props.navigation.goBack(null);
    }

    _focusNextField(key) {
        this.inputs[key].focus();
    }

    _inputFocused(refName) {
        if (Platform.OS === 'ios') {
            setTimeout(() => {
                let scrollResponder = this.scrollView.getScrollResponder();
                scrollResponder.scrollResponderScrollNativeHandleToKeyboard(
                    findNodeHandle(this.inputs[refName]),
                    0,
                    true
                );
            }, 50);
        }
    }

    _startActivityIndicator(text) {
        if (!this.state.loadingIndicatorVisible) {
            this.setState({loadingIndicatorVisible: true});
            this._setActivityIndicatorText(text);
        }
    }

    _stopActivityIndicator() {
        if (this.state.loadingIndicatorVisible) {
            this.setState({loadingIndicatorVisible: false});
            this._setActivityIndicatorText('');
        }
    }

    _setActivityIndicatorText(text) {
        this.setState({loadingIndicatorText: text});
    }

    render() {
        return (
            <ImageBackground source={require('../Images/background.jpg')} resizeMode={'cover'}  style={{flex: 1}}>
                <View style={[styles.containerOpacityMain, {position:'absolute', left: 0, right: 0, top: 0, bottom: 0}]}/>
                <SafeAreaView style={{flex:1}}>
                    <ScrollView style={{flex:1}} ref={view => {this.scrollView = view}} contentContainerStyle={{justifyContent:'space-between', flexGrow: 1}}>
                        <View style={{flex: 2, flexDirection: 'row'}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 6, alignItems: 'center'}}>
                                <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-end'}}>
                                    <Text style={[styles.textStandardDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.welcomeTo}</Text>
                                </View>
                                <View style={{flex: 0, flexDirection:'row', alignItems: 'flex-end'}}>
                                    <Text style={[styles.textLargeDark, styles.containerPadding, {textAlign: 'center', fontFamily:tastemateFont}]}>Tastemate </Text>
                                </View>
                                <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-start'}}>
                                    <Text style={[styles.textStandardDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.tastemateDescription}</Text>
                                </View>
                                <View style={{flex: 1, flexDirection:'row', alignItems: 'flex-start'}}>
                                    <Text style={[styles.textTitleBoldDark, styles.containerPadding, {textAlign: 'center'}]}>{strings.getEating}</Text>
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                        <View name={'inputWrapper'} style={[styles.containerPadding, {flex: 2}]}>
                            <TextInputComponent
                                ref={input => {this.inputs['email'] = input;}}
                                onFocus={() => this._inputFocused('email')}
                                fontawesome={true}
                                placeholder={strings.emailAddress}
                                value={this.state.email}
                                onChangeText={(text) => this.setState({email: text})}
                                icon={iconEmail}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('password');}}
                            />
                            <TextInputComponent
                                ref={input => {this.inputs['password'] = input;}}
                                onFocus={() => this._inputFocused('password')}
                                fontawesome={true}
                                placeholder={strings.password}
                                icon={iconPassword}
                                onChangeText={(text) => this.setState({password: text})}
                                keyboardType={'default'}
                                secureTextEntry={true}
                                returnKeyType={this.state.signUpActive ? 'next' : 'join' }
                                returnKeyLabel={this.state.signUpActive ? null : strings.logIn}
                                onSubmitEditing={() => {
                                    this.state.signUpActive ? this._focusNextField('username') : this._onPressSubmit();
                                }}
                            />
                            <TextInputComponent
                                ref={input => {this.inputs['username'] = input;}}
                                onFocus={() => this._inputFocused('username')}
                                fontawesome={true}
                                hidden={!this.state.signUpActive}
                                placeholder={strings.username}
                                value={this.state.username}
                                onChangeText={(text) => this.setState({username: _formatUsername(text)})}
                                icon={iconUser}
                                keyboardType={'default'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => {this._focusNextField('location');}}
                                maxLength={maxUsernameLength}
                            />
                            <TextInputComponent
                                ref={input => {this.inputs['location'] = input;}}
                                onFocus={() => this._inputFocused('location')}
                                fontawesome={true}
                                hidden={!this.state.signUpActive}
                                placeholder={strings.location}
                                value={this.state.location}
                                onChangeText={(text) => this.setState({location: text})}
                                icon={iconLocation}
                                keyboardType={'default'}
                                returnKeyType={'join'}
                                returnKeyLabel={strings.signUp}
                                onSubmitEditing={() => {this._onPressSubmit()}}
                            />
                            <View style={[this.state.error ? styles.containerOpacityMain : {}, styles.rightRoundedEdges, styles.leftRoundedEdges, {flex: 0, flexDirection:'row', alignItems: 'center', justifyContent:'center'}]}>
                                <Text style={[styles.textStandard, styles.containerPadding, {textAlign: 'center', color:colorAccent}]}>{this.state.error}</Text>
                            </View>
                        </View>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'center'}}>
                            <View style={{flex: 1}}/>
                            <View style={{flex: 6, alignItems: 'center'}}>
                                <View name={'submitButtonWrapper'} style={[styles.containerPadding]}>
                                    <TouchableOpacity name={'saveChangesButton'} onPress={this._onPressSubmit} style={[{backgroundColor:colorAccent}, styles.containerPadding, styles.leftRoundedEdges, styles.rightRoundedEdges]}>
                                        <Text style={[styles.textTitleBoldLight, styles.containerPadding]}>{this.state.signUpActive ? strings.signUp: strings.logIn}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View name={'changeButtonWrapper'} style={[styles.containerPadding]}>
                                    <TouchableOpacity name={'changeButton'} onPress={this._onPressSwitch}>
                                        <Text name={'other'} style={[styles.textStandardDark, {textAlign: 'center'}]}>{this.state.signUpActive ? strings.alreadyAccount: strings.noAccount}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View name={'skipButtonWrapper'} style={[styles.containerPadding]}>
                                    <TouchableOpacity name={'skipButton'} onPress={this._onPressSkip}>
                                        <Text name={'skip'} style={[styles.textStandardDark, {textAlign: 'center'}]}>{strings.skip}</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={{flex: 1}}/>
                        </View>
                    </ScrollView>
                </SafeAreaView>
                {
                    this.state.loadingIndicatorVisible &&
                    <ActivityIndicatorComponent visible={this.state.loadingIndicatorVisible} text={this.state.loadingIndicatorText}/>
                }
            </ImageBackground>
        );
    }
}
