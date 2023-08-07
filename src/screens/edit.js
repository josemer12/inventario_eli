import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { database } from '../config/fb';

export default function Edit() {
  const route = useRoute();
  const navigation = useNavigation();
  const [editedItem, setEditedItem] = useState({
    emoji: '',
    name: '',
    price: '',
  });

  useEffect(() => {
    const { productId } = route.params;
    // Fetch the product details from Firebase
    const getProductDetails = async () => {
      const productRef = doc(database, 'products', productId);
      const productSnapshot = await getDoc(productRef);
      if (productSnapshot.exists()) {
        const data = productSnapshot.data();
        setEditedItem(data);
      }
    };
    getProductDetails();
  }, []);

  const handleSaveChanges = async () => {
    const { productId } = route.params;
    const productRef = doc(database, 'products', productId);
    try {
      await updateDoc(productRef, editedItem);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Product</Text>
      <Text style={styles.label}>Emoji:</Text>
      <TextInput
        value={editedItem.emoji}
        onChangeText={(text) => setEditedItem({ ...editedItem, emoji: text })}
        style={styles.input}
      />
      <Text style={styles.label}>Name:</Text>
      <TextInput
        value={editedItem.name}
        onChangeText={(text) => setEditedItem({ ...editedItem, name: text })}
        style={styles.input}
      />
      <Text style={styles.label}>Price:</Text>
      <TextInput
        value={editedItem.price}
        onChangeText={(text) => setEditedItem({ ...editedItem, price: text })}
        style={styles.input}
        keyboardType='numeric'
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 20,
  },
});
