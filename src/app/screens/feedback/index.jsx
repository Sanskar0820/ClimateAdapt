import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Header from '../../../component/Header';
import PlaceAttributes from '../../../../assets/PlaceAttributes.json';
import { useTranslation } from 'react-i18next';
import { useSelectedFeature } from '../../../context/SelectedFeatureContext';


const FeedbackScreen = () => {
  const {
    handleDistrictSelect,
    handleTehsilSelect,
    selectedDistrict,
    selectedTehsil,
    tehsilList
  } = useSelectedFeature();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslation();

  const handleSubmit = async () => {
    console.log(name,
      email,
      selectedDistrict,
      selectedTehsil,
      message,)
    if (!message || !selectedTehsil || !selectedDistrict) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    const feedbackData = {
      name,
      email,
      district:selectedDistrict,
      taluka:selectedTehsil,
      message,
    };

    try {
      console.log('1')
      const response = await fetch('https://climate-adapt-ext-server.onrender.com/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      console.log('2')
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      console.log('3')
      Alert.alert('Success', 'Feedback submitted successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.log('4')
      Alert.alert('Error', 'Failed to submit feedback.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Name (Optional)</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Enter your name" />

        <Text style={styles.label}>Email (Optional)</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" />

        <Text style={styles.label}>{t('data.select_district')} *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedDistrict}
            style={styles.picker}
            onValueChange={(itemValue) => handleDistrictSelect(itemValue)}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            {[
              ...new Set(PlaceAttributes.map((item) => item.DISTRICT)) // Store only district names in Set
            ].map((district, index) => (
              <Picker.Item key={index} label={t(`location.${district}`)} value={district} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t('data.select_block')} *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedTehsil}
            style={styles.picker}
            enabled={tehsilList && tehsilList.length > 0}
            onValueChange={(itemValue) => handleTehsilSelect(itemValue)}
          >
            <Picker.Item label={t('data.select_placeholder')} value="" />
            {[...new Set(tehsilList && tehsilList.map((item) => ({
              key: item.TEHSIL,
              label: t(`location.${item.TEHSIL}`) // Fetching translations
            })))].map((item, index) => (
              <Picker.Item key={index} label={item.label} value={item.key} />
            ))}
          </Picker>
        </View>
        


        <Text style={styles.label}>Message *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={message}
          onChangeText={setMessage}
          placeholder="Enter your message"
          multiline
        />



        <Button title="Submit Feedback" onPress={handleSubmit} color="#007BFF" />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    height: 50,
  },
});

export default FeedbackScreen;