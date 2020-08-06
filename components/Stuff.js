import React, { PureComponent } from 'react';
import { StyleSheet, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Icon } from 'react-native-elements'
import { ClosedStuff } from './ClosedStuff'
import { OpenedStuff } from './OpenedStuff'
import { EditingStuff } from './EditingStuff';

const iconColor = '#FFFFFF';

let us = {};

class Stuff extends PureComponent {
    id = -1;
    interface = null;

    constructor(props) {
        super(props);
        this.id = props.id;
        this.interface = props.interface;
        this.state = {
            name: props.name,
            shop: props.shop,
            minPrice: props.minPrice,
            maxPrice: props.maxPrice,
            count: props.count,
            unit: props.unit,
            barCode: props.barCode,
            stuffStatus: props.stuffStatus,
            editing: props.editing,
            opened: false,
        };
        us[this.id] = this;
        this.interface("register", this.id, this);
    }

    edit() {
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

    openClose() {
        this.setState({opened: !this.state.opened});
    }
    
    reciever(id, fieldName, value) {
        us[id].state[fieldName] = value;
        us[id].interface("update", id, us[id].state);
    }

    refresh() {
        this.setState({opened: !this.state.opened});
        this.setState({opened: !this.state.opened});
    }

    render() {
        const {name, shop, minPrice, maxPrice, count, unit, barCode, stuffStatus, editing, opened} = this.state;
        return (
            <View style={styles.stuff}>
                {editing == false && <TouchableOpacity style={styles.stuffData} onPress={() => this.openClose()}>
                    {opened == false && <ClosedStuff
                        name={name}
                        count={count}
                        unit={unit}
                    />}
                    {opened == true && <OpenedStuff
                        name={name}
                        shop={shop}
                        minPrice={minPrice} 
                        maxPrice={maxPrice}
                        count={count}
                        unit={unit}
                        barCode={barCode}
                    />}    
                </TouchableOpacity>}
                {editing == true && <EditingStuff
                    id={this.id}
                    name={name}
                    shop={shop}
                    minPrice={minPrice} 
                    maxPrice={maxPrice}
                    count={count}
                    unit={unit}
                    barCode={barCode}
                    interface={this.reciever}
                />}
                <TouchableOpacity style={styles.button} onPress={() => this.edit()}>
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
        alignContent: 'space-between'
    },
    stuffData: {
        alignContent: 'stretch',
        flex: 1,
    },
    button: {
        justifyContent: 'center',
        alignContent: 'center',
        width: 34,
    },
    icon: {
        margin: 5,
    }
});