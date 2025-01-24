import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, Linking, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../../component/Header'

const ContactScreen = () => {
  const contacts = [
    {
      name: 'Dr. Vimal Mishra',
      position: 'Professor, Civil Engineering',
      institution: 'IIT Gandhinagar',
      email: 'vmishra@iitgn.ac.in',
      image: require('../../../../assets/images/VimalMishra.jpeg'),
      scholarLink: 'https://scholar.google.co.in/citations?user=wq7CgpUAAAAJ&hl=en'
    },
    {
      name: 'Rajesh Singh',
      position: 'Research Associate, Civil Engineering',
      institution: 'IIT Gandhinagar',
      email: 'rajesh.singh@iitgn.ac.in',
      image: require('../../../../assets/images/rajesh_singh.jpg'),
      scholarLink: 'https://scholar.google.co.in/citations?user=2fmbJF8AAAAJ&hl=en&oi=ao'
    },
    {
      name: 'Dipesh Singh Chuphal',
      position: 'PhD Research Scholar, Civil Engineering',
      institution: 'IIT Gandhinagar',
      email: 'dipeshsc@iitgn.ac.in',
      image: require('../../../../assets/images/dipesh.jpg'),
      scholarLink: 'https://vmishra.people.iitgn.ac.in/water&climate/#/people/Dipesh%20Singh%20Chuphal'
    }
  ];

  const handleEmailPress = (email) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleScholarPress = (link) => {
    Linking.openURL(link);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Contact Us</Text>
        
        {contacts.map((contact, index) => (
          <View key={index} style={styles.contactCard}>
            <Image 
              source={contact.image}
              style={styles.contactImage}
            />
            <View style={styles.contactInfo}>
              <TouchableOpacity onPress={() => handleScholarPress(contact.scholarLink)}>
                <Text style={styles.name}>{contact.name}</Text>
              </TouchableOpacity>
              <Text style={styles.position}>{contact.position}</Text>
              <Text style={styles.institution}>{contact.institution}</Text>
              <TouchableOpacity onPress={() => handleEmailPress(contact.email)}>
                <Text style={styles.email}>{contact.email}</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default ContactScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#003580',
    textAlign: 'center'
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  contactImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 4,
  },
  position: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  institution: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    color: '#003580',
    textDecorationLine: 'underline',
  }
}) 