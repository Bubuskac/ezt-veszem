import { StatusBar } from 'expo-status-bar';
import React, { PureComponent } from 'react';
import { StyleSheet, View, TouchableHighlight, Text, FlatList } from 'react-native';
import { Stuff } from './components/Stuff';
import { MainTools } from './components/MainTools';
import AsyncStorage from '@react-native-community/async-storage';

let me = null;

export default class EztVedd extends PureComponent {
    maxId = 1;

    constructor() {
        super();
        this.state = {
            itemList: [],
            refreshList: true
        }
        me = this;
        this.loadStuff();
    }

    async loadStuff() {
        try {
            const value = await AsyncStorage.getItem('stuffToBuy')
            if (value !== null) {
                const itemList = JSON.parse(value);
                this.setStuff(itemList);
                itemList.forEach(item => {
                    if (item.id >= this.maxId) {
                        this.maxId = item.id + 1;
                    }
                });
            }
        } catch(e) {
            console.log(e);
        }
    }

    async saveStuff() {
        try {
            await AsyncStorage.setItem('stuffToBuy', JSON.stringify(this.state.itemList));
          } catch (e) {
            console.log(e);
          }
    }

    setStuff(items) {
        this.setState({
            itemList: items,
            refreshList: !this.state.refreshList
        });
    }

    addNew() {
        let items = this.state.itemList;
        items.push({
            id: this.maxId + '',
            name: '',
            shop: '',
            minPrice: '0',
            maxPrice: '0',
            barCode: '',
            stuffStatus: 'new',
            editing: true,
        });
        this.maxId++;
        this.setStuff(items);
    }

    removeStuff(id) {
        let items = this.state.itemList;
        this.setStuff(items.filter(stuff => stuff.id !== id));
    }

    updateStuff(id, stuff) {
        let items = this.state.itemList;
        const i = items.findIndex(item => item.id === id)
        let item = items[i];
        item.name = stuff.name;
        item.shop = stuff.shop;
        item.maxPrice = stuff.maxPrice;
        item.minPrice = stuff.minPrice;
        item.editing = stuff.editing;
        items[i] = item;
        this.setStuff(items);
    }

    reciever(type, id, stuff) {
        if (type == "remove") {
            me.removeStuff(id);
        }
        if (type == "update") {
            me.updateStuff(id, stuff);
        }
        if (type == "new") {
            me.addNew();
        }
        if (type == "save") {
            me.saveStuff();
        }
    }
    
    render() {
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
                               editing={item.editing}
                               interface={this.reciever}
                            />
                        )
                    }}
                    extraData={this.state.refreshList}
                    keyExtractor={stuff => stuff.id}
                    style={styles.list}
                />
                <MainTools interface={this.reciever} />
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
});
