import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'

class MainTools extends PureComponent {
    interface = null

    constructor(props) {
        super(props);
        this.interface = props.interface;
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