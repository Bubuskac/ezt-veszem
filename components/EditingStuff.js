import React, { PureComponent } from 'react';
import { StyleSheet, Text, TextInput, View, Picker } from 'react-native';

class EditingStuff extends PureComponent {
    id = 0;
    interface = null;
    parent = null;

    constructor(props) {
        super(props);
        this.id = props.id;
        this.interface = props.interface;
        this.parent = props.parent;
        this.state = {
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            count: props.count,
            unit: props.unit,
            barCode: props.barCode,
            editing: true,
        };
    }

    editField(fieldName, value) {
        this.state[fieldName] = value;
        this.interface.call(this.parent, this.id, fieldName, value);
    }

    render() {
        const {name, shop, minPrice, maxPrice, count, unit, barCode } = this.state;
        return (
            <View style={styles.stuff}>
                <View style={[styles.stuffContainer]}>
                    <Text style={styles.label}>Honnan vennéd?</Text>
                    <TextInput style={styles.text} value={shop}
                        onChangeText={(shop) => this.editField('shop', shop)}/>
                </View>
                <View style={[styles.stuffContainer]}>
                    <Text style={styles.label}>Mit vennél?</Text>
                    <TextInput style={[styles.text]} value={name} 
                        onChangeText={(name) => this.editField('name', name)} />
                    <Text style={styles.label}>Mennyit vennél?</Text>
                    <TextInput style={[styles.text]} value={count}
                        onChangeText={(count) => this.editField('count', count)} />
                    <Text style={styles.label}>Milyen kiszerelés?</Text>
                    <Picker
                        selectedValue={this.state.unit}
                        style={styles.picker}
                        onValueChange={itemValue => this.editField('unit', itemValue)} >
                        <Picker.Item label='db' value='db' />
                        <Picker.Item label='kg' value='kg' />
                        <Picker.Item label='dkg' value='dkg' />
                        <Picker.Item label='üveg' value='üveg' />
                        <Picker.Item label='flakon' value='flakon' />
                        <Picker.Item label='csomag' value='csomag' />
                        <Picker.Item label='zsák' value='zsák' />
                    </Picker>
                </View>
                <View style={[styles.priceContainer, styles.stuffContainer]}>
                    <Text style={styles.label}>Az ára</Text>
                    <TextInput style={[styles.text, styles.priceInput]} value={minPrice}
                        onChangeText={(minPrice) => this.editField('minPrice', minPrice)} />
                    <Text style={styles.label}> és </Text>
                    <TextInput style={[styles.text, styles.priceInput]} value={maxPrice}
                        onChangeText={(maxPrice) => this.editField('maxPrice', maxPrice)} />
                    <Text style={styles.label}> között</Text>
                </View>
            </View>
        );
    }
}

export { EditingStuff }

const styles = StyleSheet.create({
    stuff: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        alignContent: 'space-around'
    },
    text: {
        color: '#FFFFFF',
        margin: 5,
        backgroundColor: '#388E3C',
        width: 160,
        padding: 3,
    },
    stuffContainer: {
        justifyContent: 'center',
        flex: 1,
        alignItems: 'center',
    },
    priceContainer: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 10,
        color: '#FFFFFF',
    },
    priceInput: {
        width: 50,
    },
    picker: {
        backgroundColor: '#388E3C',
        width: 160,
        height: 25,
        color: '#FFFFFF',
    },
});