import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

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
        this.setState({
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            barCode: props.barCode,
            stuffState: props.stuffState,
        });
    }

    render() {
        return (
            <View style={styles.stuff}>
                <Text style={{color: '#FFFFFF'}}>{this.id + ''}. Sajt</Text>
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
    },
});