// import { StyleSheet, Text, View, SafeAreaView, ScrollView, Linking } from 'react-native';
// import React from 'react';
// import Header from '../../../component/Header';
// import { useTranslation } from 'react-i18next';

// const InfoScreen = () => {
//   const { t } = useTranslation();

//   return (
//     <SafeAreaView style={styles.container}>
//       <Header />
//       <ScrollView style={styles.content}>
//         <View style={styles.section}>
//           <Text style={styles.heading}>{t('info.observed_data')}</Text>
//           <Text style={styles.paragraph}>{t('info.observed_text')}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.heading}>{t('info.forecasted_data')}</Text>
//           <Text style={styles.subHeading}>{t('info.short_range_forecast')}</Text>
//           <Text style={styles.paragraph}>{t('info.short_range_text')}</Text>

//           <Text style={styles.subHeading}>{t('info.extended_range_forecast')}</Text>
//           <Text style={styles.paragraph}>{t('info.extended_range_text')}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.heading}>{t('info.hydrologic_model')}</Text>
//           <Text style={styles.paragraph}>
//             {t('info.hydrologic_text')}{' '}
//             <Text 
//               style={styles.link}
//               onPress={() => Linking.openURL('https://vic.readthedocs.io/en/master/#variable-infiltration-capacity-vic-macroscale-hydrologic-model')}
//             >
//               https://vic.readthedocs.io
//             </Text>
//           </Text>
//         </View>

//         <View style={[styles.section, styles.lastSection]}>
//           <Text style={styles.heading}>{t('info.references')}</Text>
//           <Text style={styles.paragraph}>{t('info.references_text')}</Text>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default InfoScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   content: { flex: 1, padding: 20 },
//   section: { marginBottom: 25 },
//   lastSection: { marginBottom: 40 },
//   heading: { fontSize: 24, fontWeight: 'bold', color: '#003580', marginBottom: 15 },
//   subHeading: { fontSize: 18, fontWeight: 'bold', color: '#333', marginTop: 15, marginBottom: 10 },
//   paragraph: { fontSize: 16, lineHeight: 24, color: '#444', marginBottom: 15, textAlign: 'justify' },
//   link: { color: '#003580', textDecorationLine: 'underline' }
// });





import { StyleSheet, Text, View, SafeAreaView, ScrollView, Linking } from 'react-native'
import React from 'react'
import Header from '../../../component/Header'
import { useTranslation } from 'react-i18next';

const InfoScreen = () => {
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>{t('info.observed_data')}</Text>
          <Text style={styles.paragraph}>{t('info.observed_text')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{t('info.forecasted_data')}</Text>
          <Text style={styles.subHeading}>{t('info.short_range_forecast')}</Text>
          <Text style={styles.paragraph}>{t('info.short_range_text')}</Text>

          <Text style={styles.subHeading}>{t('info.extended_range_forecast')}</Text>
          <Text style={styles.paragraph}>{t('info.extended_range_text')}</Text>
          <Text style={styles.paragraph}>{t('info.extended_range_text1')}</Text>
          <Text style={styles.paragraph}>{t('info.extended_range_text2')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>{t('info.hydrologic_model')}</Text>
          <Text style={styles.paragraph}>{t('info.hydrologic_text')}{' '}<Text
              style={styles.link}
              onPress={() => Linking.openURL('https://vic.readthedocs.io/en/master/#variable-infiltration-capacity-vic-macroscale-hydrologic-model')}
            >
              https://vic.readthedocs.io
            </Text>
          </Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.heading}>{t('info.references')}</Text>
          <Text style={styles.paragraph}>
          {t('info.references_text')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default InfoScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  lastSection: {
    marginBottom: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003580',
    marginBottom: 15,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
    marginBottom: 15,
    textAlign: 'justify',
  },
  link: {
    color: '#003580',
    textDecorationLine: 'underline',
  }
}) 
