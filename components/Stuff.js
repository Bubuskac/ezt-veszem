import React, { PureComponent } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { Icon } from 'react-native-elements'

const iconColor = '#FFFFFF';

class Stuff extends PureComponent {
    id = -1
    interface = null

    constructor(props) {
        super(props);
        this.id = props.id;
        this.interface = props.interface;
        this.state = {
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            barCode: props.barCode,
            stuffStatus: props.stuffStatus,
            editing: props.editing,
        };
    }

    edit(event) {
        if (event.target.value) {
            return;
        }
        this.state.editing = !this.state.editing;
        this.interface("update", this.id, this.state);
    }

    editField(fieldName, value) {
        this.state[fieldName] = value;
        this.interface("update", this.id, this.state);
    }

    delete() {
        this.interface("remove", this.id);
    }

    render() {
        const {name, shop, minPrice, maxPrice, barCode, stuffState, editing} = this.state;
        return (
            <View style={styles.stuff} onPress={(event) => console.log(event)}>
                <View style={[styles.shop, styles.stuffContainer]}>
                    {editing == false && <Text style={styles.text}>{shop}</Text>}
                    {editing == true && <TextInput style={[styles.text, styles.editor]}
                        value={shop} 
                        onChangeText={(shop) => this.editField('shop', shop)}/>}
                </View>
                <View style={[styles.name, styles.stuffContainer]}>
                    {editing == false && <Text style={[styles.nameText, styles.text]}>{name}</Text>}
                    {editing == true && <TextInput style={[styles.nameText, styles.text, styles.editor]}
                        value={name}
                        onChangeText={(name) => this.editField('name', name)}/>}
                </View>
                <View style={[styles.price, styles.stuffContainer]}>
                    {editing == false && minPrice != 0 && <Text style={styles.text}>drágább mint {minPrice}</Text>}
                    {editing == true && <TextInput style={[styles.text, styles.editor]}
                        value={minPrice} 
                        onChangeText={(minPrice) => this.editField('minPrice', minPrice)}/>}
                    {editing == false && maxPrice != 0 && <Text style={styles.text}>olcsóbb mint {maxPrice}</Text>}
                    {editing == true && <TextInput style={[styles.text, styles.editor]}
                        value={maxPrice} 
                        onChangeText={(maxPrice) => this.editField('maxPrice', maxPrice)}/>}
                </View>
                <TouchableOpacity onPress={(event) => this.edit(event)}>
                    {editing == false && <Icon name={'pen'} style={styles.icon} color={iconColor} type={'font-awesome-5'}/>}
                    {editing == true && <Icon name={'check'} style={styles.icon} color={iconColor} type={'font-awesome-5'}/>}
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => this.delete()}>
                    <Icon name={'trash-alt'} style={styles.icon} color={iconColor} type={'font-awesome-5'}/>
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
        fontSize: 28,
    },
    price: {
        alignItems: 'flex-end',
        marginRight: 20,
    },
    editor: {
        backgroundColor: '#388E3C',
    },
    icon: {
        margin: 10,
    }
});