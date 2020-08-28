import { StatusBar } from 'expo-status-bar';
import React, { PureComponent } from 'react';
import { StyleSheet, View, Dimensions, FlatList, Platform } from 'react-native';
import { Stuff } from './components/Stuff';
import { MainTools } from './components/MainTools';
import AsyncStorage from '@react-native-community/async-storage';
import * as GoogleSignIn from 'expo-google-sign-in';
import config from './config.json';

export default class EztVedd extends PureComponent {
    minId = -1;
    stuffListView = null;
    email = null;
    gToken = null;
    stuff = [];
    removedStuff = [];

    constructor() {
        super();
        this.state = {
            itemList: [],
            refreshList: true,
            editing: false,
        }
        this.loadStuff();
        this.setUpGoogle();
    }

    async setUpGoogle() {
        try {
            if (Platform.OS == 'android') {
                await GoogleSignIn.initAsync({
                    clientId: config.cliendIdAndroid,
                    webClientId: config.clientId
                });
            }
        } catch(e) {
            console.log(e);
        }
    }

    async loadStuff(remote) {
        try {
            if (!remote) {
                const value = await AsyncStorage.getItem('stuffToBuy')
                if (value !== null) {
                    const itemList = JSON.parse(value);
                    this.setStuff(itemList);
                    itemList.forEach(item => {
                        if (item.id <= this.minId) {
                            this.minId = item.id - 1;
                        }
                    });
                }
            }
            if (this.gToken) {
                let response = await fetch(config.api, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: this.gToken,
                        method: "load"
                    })
                });
                let json = await response.json();
                if (json.message == "Stuff loaded") {
                    json.stuff.forEach(stuff => {
                        let item = this.stuff.find(item => item.id == stuff.id);
                        if (item) {
                            item.reciever(item.id, "shop", stuff.shop);
                            item.reciever(item.id, "name", stuff.name);
                            item.reciever(item.id, "minPrice", stuff.minPrice);
                            item.reciever(item.id, "maxPrice", stuff.maxPrice);
                            item.reciever(item.id, "count", stuff.count);
                            item.reciever(item.id, "unit", stuff.unit);
                            item.reciever(item.id, "stuffStatus", stuff.stuffStatus);
                            item.reciever(item.id, "barCode", stuff.barCode);
                            item.refresh();
                        }
                    });
                    this.setStuff(json.stuff);
                }
            }
        } catch(e) {
            console.log(e);
        }
    }

    async saveStuff(notAgain) {
        try {
            await AsyncStorage.setItem('stuffToBuy', JSON.stringify(this.state.itemList));
            if (this.gToken) {
                let response = await fetch(config.api, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        token: this.gToken,
                        stuff: this.state.itemList,
                        removedStuff: this.removedStuff,
                        method: "save"
                    })
                });
                let json = await response.json();
                if (json.message == "Stuff stored") {
                    this.updateStuffIds(json.stuff);
                    this.removedStuff = [];
                } else if (!notAgain){
                    this.saveStuff(true);
                }
            }
          } catch (e) {
            console.log(e);
          }
    }

    setStuff(items) {
        const editing = items.findIndex(item => item.editing) > -1;

        this.setState({
            itemList: items,
            refreshList: !this.state.refreshList,
            editing: editing
        });
    }

    addNew() {
        let items = this.state.itemList;
        items.push({
            id: this.minId + '',
            name: '',
            shop: '',
            minPrice: '0',
            maxPrice: '0',
            count: '',
            unit: 'db',
            barCode: '',
            stuffStatus: 'new',
            editing: true,
        });
        this.minId--;
        this.setStuff(items);
        this.stuffListView.scrollToEnd();
    }

    removeStuff(id) {
        let items = this.state.itemList;
        this.setStuff(items.filter(stuff => stuff.id !== id));
        if (id > 0) {
            this.removedStuff.push(id);
        }
    }

    updateStuff(id, stuff) {
        let items = this.state.itemList;
        const i = items.findIndex(item => item.id === id);
        let item = items[i];
        item.name = stuff.name;
        item.shop = stuff.shop;
        item.maxPrice = stuff.maxPrice;
        item.minPrice = stuff.minPrice;
        item.count = stuff.count;
        item.unit = stuff.unit;
        item.editing = stuff.editing;
        items[i] = item;
        this.setStuff(items);
    }

    updateStuffIds(stuffIds) {
        let items = this.state.itemList;
        stuffIds.forEach((ids) => {
            const i = items.findIndex(item => item.id === ids.o);
            let item = items[i];
            item.id = ids.n;
            items[i] = item;
        });
        this.setStuff(items);
    }

    reciever(type, id, stuff) {
        if (type == "remove") {
            this.removeStuff(id);
        }
        if (type == "update") {
            this.updateStuff(id, stuff);
        }
        if (type == "new") {
            this.addNew();
        }
        if (type == "save") {
            this.saveStuff();
        }
        if (type == "email") {
            this.email = id;
        }
        if (type == "token") {
            if (this.gToken !== id) {
                this.gToken = id;
                if (id != null) {
                    this.loadStuff(true);
                }
            }
        }
        if (type == "register") {
            this.stuff.push(stuff);
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
                               count={item.count}
                               unit={item.unit}
                               barCode={item.barCode}
                               stuffStatus={item.stuffStatus}
                               editing={item.editing}
                               interface={this.reciever}
                               parent={this}
                            />
                        )
                    }}
                    extraData={this.state.refreshList}
                    keyExtractor={stuff => stuff.id + ""}
                    style={styles.list}
                    ref={(ref) => { this.stuffListView = ref; }}
                />
                {!this.state.editing && <MainTools interface={this.reciever} parent={this} />}
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
        height: Dimensions.get('window').height - 20,
    },
});
