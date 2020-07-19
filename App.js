import { StatusBar } from 'expo-status-bar';
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, FlatList } from 'react-native';
import { Stuff } from './components/Stuff'

let me = null;

export default class EztVedd extends PureComponent {
    constructor() {
        super();
        this.state = {
            itemList: [],
            refreshList: true
        }
    }

    setStuff(items) {
        me.setState({
            itemList: items,
            refreshList: !me.state.refreshList
        });
    }

    addNew() {
        let items = me.state.itemList;
        items.push({
            id: items.length + 1 + '',
            name: 'sajt',
            shop: 'Penny',
            minPrice: 0,
            maxPrice: 0,
            barCode: '',
            stuffStatus: 'new'
        });
        me.setStuff(items);
    }
    
    render() {
        me = this;
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.itemList}
                    renderItem={({item}) => {
                        return ( 
                            <Stuff id={item.id}
                               name={item.name}
                               shop={item.shop}
                               minPrice={item.minPrice} 
                               maxPrice={item.maxPrice}
                               barCode={item.barCode}
                               stuffStatus={item.stuffStatus}
                            />
                        )
                    }}
                    extraData={this.state.refreshList}
                    keyExtractor={stuff => stuff.id}
                    style={styles.list}
                />
                <View style={styles.buttonContainer}>
                    <TouchableHighlight onPress={this.addNew} style={styles.button}>
                        <Text style={styles.plusSign}>+</Text>
                    </TouchableHighlight>
                </View>
                <StatusBar style="auto" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'space-between',
        margin: 10,
    },
    list: {
        height: '90vh',
    },
    buttonContainer: {
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
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
    },
    plusSign: {
        color: 'white',
        fontSize: '2rem',
        marginTop: '-0.5rem',
    }
});
