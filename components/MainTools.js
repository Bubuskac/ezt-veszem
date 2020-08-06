import React, { PureComponent } from 'react';
import { StyleSheet, Image, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { GoogleLogin, GoogleLogout } from 'react-google-login';
import config from '../config.json';

let me = null;

class MainTools extends PureComponent {
    interface = null;
    webOrAndroid = 'android';

    constructor(props) {
        super(props);
        this.interface = props.interface;
        this.webOrAndroid = props.webOrAndroid;
        this.state = {
            profilePicture: null
        }
        me = this;
    }

    login() {
        console.log('TODO android google login');
    }

    receivedResponse(response) {
        if (response) {
            const profile = response.getBasicProfile();
            me.interface('email', profile.getEmail());
            me.interface('token', response.getAuthResponse().id_token);
            me.setState({ profilePicture: profile.getImageUrl()});
        } else {
            me.interface('email', null);
            me.interface('token', null);
            me.setState({ profilePicture: null});
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
                {this.webOrAndroid == 'android' && <TouchableOpacity onPress={() => this.login()} style={styles.button}>
                    <Icon name={'google'} color={'#FFFFFF'} type={'font-awesome-5'}/>
                </TouchableOpacity>}
                {this.webOrAndroid == 'web' && this.state.profilePicture == null && <GoogleLogin
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
                {this.state.profilePicture != null && <GoogleLogout
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