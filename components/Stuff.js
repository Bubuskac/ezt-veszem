import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

class Stuff extends PureComponent {
    id = -1
    state = {
        name: '',
        shop: '',
        minPrice: 0,
        maxPrice: 0,
        barCode: '',
        stuffState: '',
    }
    constructor(props) {
        super(props);
        this.id = props.id;
        this.state = {
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            barCode: props.barCode,
            stuffState: props.stuffState,
        };
    }

    render() {
        const {name, shop, minPrice, maxPrice, barCode, stuffState} = this.state;
        return (
            <View style={styles.stuff}>
                <View style={[styles.shop, styles.stuffContainer]}>
                    <Text style={styles.text}>{shop}</Text>
                </View>
                <View style={[styles.name, styles.stuffContainer]}>
                    <Text style={[styles.nameText, styles.text]}>{name}</Text>
                </View>
                <View style={[styles.price, styles.stuffContainer]}>
                    <Text style={styles.text}>{minPrice}</Text>
                    <Text style={styles.text}>{maxPrice}</Text>
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.closeSign}>X</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export { Stuff }

const styles = StyleSheet.create({
    stuff: {
        backgroundColor: '#4CAF50',
        height: 50,
        width: '99.5%',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        borderColor: '#388E3C',
        borderStyle: 'solid',
        borderWidth: 1,
        margin: 3,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-around'
    },
    button: {
        marginRight: 5,
    },
    closeSign: {
        color: '#FFFFFF',
        fontSize: '1.5rem',
    },
    text: {
        color: '#FFFFFF',
    },
    stuffContainer: {
        justifyContent: 'center',
        flex: 1,
    },
    shop: {
        alignSelf: 'flex-start',
    },
    name: {
        alignItems: 'center',
    },
    nameText: {
        fontSize: '1.8rem',
    },
    price: {
        alignItems: 'flex-end',
        marginRight: 20,
    }
});