import React from 'react';
import {FlatList, View} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import styles from "../styles";
import {ObservationExploreComponent} from "../Components/ObservationExploreComponent";
import strings from "../strings";
import {SearchBar} from "../Components/SearchBar";
import {_navigateToScreen, colorMain} from "../constants/Constants";
import firebase from 'react-native-firebase';
import {EmptyComponent} from "../Components/EmptyComponent";

const numColumns = 3;
const OBS_LOAD_DEPTH = 9;
const initialState = {
    user: null,
    isRefreshing: false,
    observations: [],
    searchText: '',
    searchTextSearched: '',
    emptyListMessage: strings.loading
};

export class SearchExploreScreen extends React.Component {
    static navigationOptions = ({navigation}) => {
        const {params = {}} = navigation.state;
        return {
            title: strings.explore + ' ',
            headerLeft: (
                <NavBarProfileButton nav={navigation} action={() => params.onProfilePressed()}/>
            ),
            headerRight: (
                <NavBarCreateObsButton nav={navigation} action={() => params.onCreateObsPressed()}/>
            ),
            headerStyle: {
                borderBottomWidth: 0,
                backgroundColor: colorMain,
                elevation: 0,
            },
        }
    };

    constructor() {
        super();

        this._addToObservationState = this._addToObservationState.bind(this);
        this._onEndReached = this._onEndReached.bind(this);
        this._onRefresh = this._onRefresh.bind(this);
        this._loadObservations = this._loadObservations.bind(this);
        this._onNavBarButtonPressed = this._onNavBarButtonPressed.bind(this);
        this._setEmptyMessage = this._setEmptyMessage.bind(this);
        this._handleError = this._handleError.bind(this);
        this._onPressSearchButton = this._onPressSearchButton.bind(this);

        this.unsubscriber = null;
        this.state = initialState;
    }

    componentDidMount() {
        this.props.navigation.setParams({
            onProfilePressed: (() => this._onNavBarButtonPressed(true)),
            onCreateObsPressed: this._onNavBarButtonPressed,
        });
        this.unsubscriber = firebase.auth().onAuthStateChanged((user) => {
            // Reset page info
            let resetState = initialState;
            resetState.user = user;
            this.setState(resetState, () => {
                if (!user) {
                    // Do nothing
                } else {
                    this._loadObservations(true, false);
                }
            });
        });
    }

    componentWillUnmount() {
        if (this.unsubscriber) {
            this.unsubscriber();
        }
    }

    _onNavBarButtonPressed(isProfile) {
        if (this.state.user && !this.state.user.isAnonymous) {
            if (isProfile) {
                let params = {};
                params.myProfile = true;
                _navigateToScreen('MyProfile', this.props.navigation, params);
            } else {
                _navigateToScreen('CreateObservation', this.props.navigation);
            }
        } else {
            _navigateToScreen('SignUpLogIn', this.props.navigation);
        }
    }

    _loadObservations(onStartup, isRefreshing) {
        const obsSize = this.state.observations.length;
        if (!this.isLoadingObservations && (obsSize === 0 || obsSize % OBS_LOAD_DEPTH === 0 || isRefreshing)) {
            const index = isRefreshing ? 0 : this.state.observations.length;
            const searchText = this.state.searchTextSearched;
            console.log('Loading ' + searchText + ' observations... Starting at ' + index + ' to ' + (index + OBS_LOAD_DEPTH));
            this.isLoadingObservations = true;

            const httpsCallable = firebase.functions().httpsCallable('getXMostRecentObs');
            httpsCallable({
                from: index,
                to: index + OBS_LOAD_DEPTH,
                searchText: searchText
            }).then(({data}) => {
                console.log('Observations successfully retrieved');
                this.isLoadingObservations = false;
                this._addToObservationState(data.observations, onStartup, isRefreshing);
            }).catch(httpsError => {
                console.log(httpsError.code);
                console.log(httpsError.message);
                this._handleError(httpsError);
                this.isLoadingObservations = false;
            })
        }
    }

    _addToObservationState(observations, onStartup, isRefreshing) {
        observations.sort(function(a,b) {
            if (a.timestamp < b.timestamp)
                return 1;
            if (a.timestamp > b.timestamp)
                return -1;
            return 0;
        });

        if (onStartup || isRefreshing || (observations && observations.length > 0)) {
            observations.sort(function (a, b) {
                if (a.timestamp < b.timestamp)
                    return 1;
                if (a.timestamp > b.timestamp)
                    return -1;
                return 0;
            });

            if (onStartup || isRefreshing) {
                this.setState({observations: observations, isRefreshing: false});
            } else {
                this.setState(prevState => ({observations: prevState.observations.concat(observations), isRefreshing: false}));
            }
        }

        this._setEmptyMessage(strings.noSearchResults);
    }

    _handleError(error){
        console.log(error);
        this._setEmptyMessage(strings.errorOccurred);
    }

    _setEmptyMessage(message) {
        this.setState({emptyListMessage: message});
    }

    _onRefresh() {
        console.log('Refreshing...');
        this.setState({isRefreshing: true});
        this._loadObservations(false, true);
    }

    _onEndReached() {
        console.log('Loading more observations...');
        this._loadObservations(false, false);
    }

    _onUpdateSearchText(searchText) {
        this.setState({searchText: searchText});
    }

    _onPressSearchButton() {
        // TODO: test if search is really working
        this.setState((prevState) => ({searchTextSearched: prevState.searchText}), () => this._loadObservations(true, true));
    }

    _keyExtractor = (item, index) => item.observationid;

    render() {
        return (
            <View name={'wrapper'} style={{flex:1}}>
                <SearchBar placeholder={strings.foodCraving}  value={this.state.searchText} onChangeText={(text) => this._onUpdateSearchText(text)} onSubmitEditing={this._onPressSearchButton} onPressSearch={this._onPressSearchButton}/>
                <View style={[{flex:1}, styles.explorePadding]}>
                    {
                        this.state.observations.length === 0 && <EmptyComponent message={this.state.emptyListMessage}/>
                    }
                    {
                        this.state.observations.length > 0 &&
                        <FlatList
                            keyExtractor={this._keyExtractor}
                            data={this.state.observations}
                            renderItem={({item}) => <ObservationExploreComponent observation={item} {...this.props}/>}
                            numColumns={numColumns}
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            onEndReached={this._onEndReached}
                        />
                    }
                </View>
            </View>
        );
    }
}
