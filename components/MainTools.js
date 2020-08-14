import React, { PureComponent } from 'react';
import { StyleSheet, Image, View, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import { Icon } from 'react-native-elements';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import * as GoogleSignIn from 'expo-google-sign-in';
import config from '../config.json';

let me = null;

class MainTools extends PureComponent {
    interface = null;

    constructor(props) {
        super(props);
        this.interface = props.interface;
        this.state = {
            profilePicture: null,
            isLoading: false
        }
        me = this;
    }

    componentDidMount() {
        if (Platform.OS == 'android' && this.state.profilePicture == null) {
            this.login();
        }
    }

    async login() {
        this.setState({isLoading: true});
        try {
            const { type, user } = await GoogleSignIn.signInAsync();
            if (type === 'success') {
                me.interface('email', user.email);
                me.setState({ profilePicture: user.photoURL});
                me.interface('token', user.auth.idToken);
            } else {
                Alert.alert(
                    "Google Login",
                    "Sikertelen belépési kisérlet: " + type,
                    [ { text: "OK", onPress: () => console.log("OK Pressed") }],
                    { cancelable: false }
                );
            }
        } catch (e) {
            Alert.alert(
                "Hiba!",
                "Sikertelen a belépés...",
                [ { text: "OK", onPress: () => console.log("OK Pressed") }],
                { cancelable: false }
            );
        }
        this.setState({isLoading: false});
    }

    async logut() {
        this.setState({isLoading: true});
        await GoogleSignIn.signOutAsync();
        this.eraseData();
    }

    eraseData() {
        me.interface('email', null);
        me.interface('token', null);
        me.setState({ profilePicture: null});
        this.setState({isLoading: false});
    }

    receivedResponse(response) {
        if (response) {
            const profile = response.getBasicProfile();
            me.interface('email', profile.getEmail());
            me.interface('token', response.getAuthResponse().id_token);
            me.setState({ profilePicture: profile.getImageUrl()});
        } else {
            me.eraseData();
        }
    }

    failedResponse(response) {
        console.error(response.message);
    }

    render() {
        return (
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => this.interface("new")} style={styles.button}>
                    <Icon name={'plus'} color={'#FFFFFF'} type={'font-awesome-5'}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.interface("save")} style={styles.button}>
                    <Icon name={'save'} color={'#FFFFFF'} type={'font-awesome-5'}/>
                </TouchableOpacity>
                {Platform.OS == 'android' && this.state.profilePicture == null && <TouchableOpacity
                    onPress={() => this.login()} style={styles.button}>
                        {this.state.isLoading ? 
                            <ActivityIndicator /> : 
                            <Icon name={'google'} color={'#FFFFFF'} type={'font-awesome-5'}/>}
                </TouchableOpacity>}
                {Platform.OS == 'android' && this.state.profilePicture != null && <TouchableOpacity
                    onPress={() => this.logout()} style={styles.button}>
                        {this.state.isLoading ? 
                            <ActivityIndicator /> : 
                            <Image style={styles.button} source={{uri: this.state.profilePicture}}/>}
                </TouchableOpacity>}
                {Platform.OS == 'web' && this.state.profilePicture == null && <GoogleLogin
                    clientId={config.clientId}
                    render={renderProps => (
                        <TouchableOpacity onPress={() => renderProps.onClick()} style={styles.button}>
                            <Icon name={'google'} color={'#FFFFFF'} type={'font-awesome-5'}/>
                        </TouchableOpacity>
                    )}
                    buttonText='G'
                    onSuccess={this.receivedResponse}
                    onFailure={this.failedResponse}
                    cookiePolicy={'single_host_origin'}
                    isSignedIn={true}
                />}
                {Platform.OS == 'web' && this.state.profilePicture != null && <GoogleLogout
                    clientId={config.clientId}
                    render={renderProps => (
                        <TouchableOpacity onPress={() => renderProps.onClick()} style={styles.button}>
                            <Image style={styles.button} source={{uri: this.state.profilePicture}}/>
                        </TouchableOpacity>
                    )}
                    buttonText=''
                    onLogoutSuccess={this.receivedResponse}
                    onFailure={this.failedResponse}
                    cookiePolicy={'single_host_origin'}
                />}
            </View>
        );
    }
}

export { MainTools }

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        height: 50,
        width: 50,
        borderRadius: 50,
        borderColor: '#445CC9',
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: '#536DFE',
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
    }
});