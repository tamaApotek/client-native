import React, {useState, useEffect} from 'react'
import {View , Text, TouchableOpacity, StatusBar} from 'react-native'
import { FontAwesome, AntDesign } from '@expo/vector-icons'
import { SwipeListView } from 'react-native-swipe-list-view';

const ListPasien =  (props) => {

    const [filtered, setFiltered] = useState([])
    const patients = props.navigation.getParam('patients', [])
    useEffect(() => {
        setFiltered(patients)
    }, [])
    return (
        <View style={{flex: 1, backgroundColor: 'whitesmoke'}}>
            <StatusBar barStyle={"dark-content"} />
            
            <SwipeListView
                data={filtered}
                disableRightSwipe={true}
                closeOnRowOpen={true}
                closeOnRowBeginSwipe={true}
                keyExtractor={ (data) => data._id}
                renderItem={ (data, rowMap) => {
                    let patient = data.item
                        return (
                            <View key={patient._id} style={styles.box}>
                                <View style={{paddingVertical: 10, paddingLeft: 25}}>
                                    <Text style={[styles.text, {fontWeight: '500', fontSize: 18}]}>{patient.patientId.fullName}</Text>
                                    <Text style={[styles.text, {fontSize: 13, color: 'rgb(48, 48, 48)'}]}>Alamat: {patient.patientId.address}</Text>
                                    <Text style={[styles.text, {fontSize: 13, color: 'rgb(48, 48, 48)'}]}>Telefon: {patient.patientId.noTelefon}</Text>
                                </View>
                                <View style={{justifyContent: 'center', paddingRight: 15}}>
                                    <AntDesign name="right" size={15} color="silver" />
                                </View>
                            </View>
                        )
                    }
                }
                renderHiddenItem={ (data, rowMap) =>
                    {
                        return (
                            <View key={data.index} style={[styles.box, {justifyContent: 'flex-end'}]}>
                                <TouchableOpacity>
                                    <View style={{width: 100, height: '100%',backgroundColor: "rgb(247, 0, 0)", alignItems: 'center', justifyContent: 'center'}}>
                                        <FontAwesome name="trash-o" size={32} color="black" />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        )
                    } 
                }
                rightOpenValue={-100}
            />
        </View>
    )
}

const styles = {
    box: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderColor: 'rgb(237, 237, 237)',
        borderBottomWidth: 1

    },
    text: {
        paddingVertical: 2
    }
}

ListPasien.navigationOptions = {
    title: 'LIST PASIEN',
};
export default ListPasien

