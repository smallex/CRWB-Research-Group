import React from 'react';
import {FlatList, Text} from 'react-native';
import {NavBarCreateObsButton, NavBarProfileButton} from "../Components/NavBarButton";
import {NotificationComponent} from "../Components/NotificationComponent";
import styles from "../styles";
import {notifications} from "../MockupData";

export class NotificationsScreen extends React.Component {
    static navigationOptions = ({navigation})=> ({
        title: 'Notifications',
        headerLeft: (
            <NavBarProfileButton nav={navigation}/>
        ),
        headerRight: (
            <NavBarCreateObsButton nav={navigation}/>
        ),
    });

    _onRefreshPulled() {
        // TODO: pull to refresh
    }

    render() {
        return (
            <FlatList
                data={notifications}
                renderItem={({item}) => <NotificationComponent notification={item.value} nav={this.props.navigation}/>}
                refreshing={false}
                onRefresh={() => this._onRefreshPulled}
                ListEmptyComponent={() => <Text style={styles.containerPadding}>Seems like you do not have any notifications yet.</Text>}
            />
        );
    }
}
//                ItemSeparatorComponent={() => <View style={styles.containerPadding}/>}