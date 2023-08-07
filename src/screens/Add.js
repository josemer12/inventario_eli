import * as React from 'react';
import * as RN from 'react-native';
import EmojiPicker from 'rn-emoji-keyboard';
import { database } from '../config/fb';
import { collection , addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Add() {
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = React.useState(false);
    const [newItem, setNewItem] = React.useState({
        emoji: '😋',
        name: '',
        price: 0,
        inSold: false,
        createdAt: new Date(),
    })
    const onSend = async () => {
        await addDoc(collection(database, 'products'), newItem);
        navigation.goBack();
        }

    const handlePick = (emojiObject) => {
        setNewItem({
            ...newItem,
            emoji: emojiObject.emoji,
        });
    }

    return (
        <RN.View style={styles.container}>
            <RN.Text style={styles.title}>Agregar Nuevo Producto</RN.Text>
            <RN.Text
                style={styles.emojiText}
                onPress={() => setIsOpen(true)}>
                {newItem.emoji}
            </RN.Text>
            <EmojiPicker
               onEmojiSelected={handlePick}
               open={isOpen}
               onClose={() => setIsOpen(false)}
            />
            <RN.TextInput
                 onChangeText={(text) => setNewItem({...newItem, name:text})}
                 placeholder='Nombre del Producto'
                 style={styles.inputContainer}
            />
            <RN.TextInput
            onChangeText={(text) => setNewItem({ ...newItem, price: parseFloat(text) })}
            placeholder='S/ Precio'
            style={styles.inputContainer}
            keyboardType='numeric' // Agregado para mostrar el teclado numérico
            />
            <RN.Button title='Publish' onPress={onSend}/>

            

        </RN.View>
    )
}

const styles = RN.StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
         
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
    },
    inputContainer: {
        width: '90%',
        padding: 13,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
    },
    emojiText: {
        fontSize: 100,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        marginVertical: 6, // Increase the font size for the emoji
    }
});
