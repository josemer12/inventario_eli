import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, query, onSnapshot, doc , deleteDoc  } from 'firebase/firestore';
import { database } from '../config/fb';

export default function Home() {
  const navigation = useNavigation();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, 'products'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(data);
    });

    return () => unsubscribe();
  }, []);

  const handleEditProduct = (productId) => {
    navigation.navigate('Edit', { productId });
  };

  const handleDeleteProduct = (productId) => {
    setSelectedProductId(productId);
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteDoc(doc(database, 'products', selectedProductId));
      setShowConfirmation(false);
      setSelectedProductId(null);
      // You may also want to update the products state to reflect the changes
      // ... (Update products state)
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emojiText}>{item.emoji}</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.nameText}>{item.name}</Text>
        <Text style={styles.priceText}>S/ {item.price}</Text>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={() => handleEditProduct(item.id)} style={styles.editButton}>
          <Text style={styles.editButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Eliminar</Text>
        </TouchableOpacity>
      </View> 
    </View>
  );

  return (
    <>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
       {showConfirmation && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.confirmationText}>¿Seguro que quiere eliminar el producto?</Text>
            <View style={styles.confirmationButtonsContainer}>
              <TouchableOpacity onPress={() => setShowConfirmation(false)} style={styles.cancelButton}>
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirmDelete} style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      <Button title="go to Add screen" onPress={() => navigation.navigate('Add')} />
    </>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9E79F',
    borderBottomWidth: 1,
    borderBottomColor: '#D4AC0D',
  },
  emojiContainer: {
    backgroundColor: '#E59866',
    borderRadius: 50,
    padding: 10,
    marginRight: 10,
  },
  emojiText: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 14,
  },
  editButton: {
    backgroundColor: '#FF5733',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semitransparente
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
  },
  confirmationText: {
    fontSize: 16,
    marginBottom: 10,
  },
  confirmationButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#FF5733',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#33FF57',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});
