import React, { PureComponent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

class OpenedStuff extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            count: props.count,
            unit: props.unit,
            barCode: props.barCode,
        };
    }

    render() {
        const {name, shop, minPrice, maxPrice, count, unit, barCode } = this.state;
        return (
            <View style={styles.stuff}>
                <View style={[styles.shop, styles.stuffContainer]}>
                    <Text style={styles.text}>{shop}</Text>
                </View>
                <View style={[styles.name, styles.stuffContainer]}>
                    <Text style={[styles.nameText, styles.text]}>{name} {count} {unit}</Text>
                </View>
                <View style={[styles.price, styles.stuffContainer]}>
                    <Text style={styles.text}>
                        {minPrice > 0 && 'drágább mint ' + minPrice}
                        {minPrice == '0' && 'nincs alsó korlát megadva'}
                    </Text>
                    <Text style={styles.text}>
                        {maxPrice > 0 && 'olcsóbb mint ' + maxPrice}
                        {maxPrice == '0' && 'nincs felső korlát megadva'}
                    </Text>
                </View>
            </View>
        );
    }
}

export { OpenedStuff }

const styles = StyleSheet.create({
    stuff: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        height: 200,
        alignContent: 'space-around'
    },
    text: {
        color: '#FFFFFF',
        margin: 5,
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
        fontSize: 28,
    },
    price: {
        alignItems: 'flex-end',
        marginRight: 20,
    }
});