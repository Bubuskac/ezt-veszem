import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class ClosedStuff extends PureComponent {
    interface = null

    constructor(props) {
        super(props);
        this.interface = props.interface;
        this.state = {
            name: props.name,
            count: props.count,
            unit: props.unit
        };
    }

    render() {
        const {name, count, unit} = this.state;
        return (
            <View style={styles.stuff}>
                <View style={[styles.name, styles.stuffContainer]}>
                    <Text style={[styles.nameText, styles.text]}>{name}</Text>
                </View>
                <View style={[styles.unit, styles.stuffContainer]}>
                    <Text style={[styles.text, styles.unitText]}>{count} {unit}</Text> 
                </View>
            </View>
        );
    }
}

export { ClosedStuff }

const styles = StyleSheet.create({
    stuff: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-around',
    },
    text: {
        color: '#FFFFFF',
    },
    stuffContainer: {
        margin: 5,
        flex: 1,
    },
    name: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: 26,
    },
    unit: {
        alignItems: 'flex-end',
    },
    unitText: {
        fontSize: 20,
    }
});