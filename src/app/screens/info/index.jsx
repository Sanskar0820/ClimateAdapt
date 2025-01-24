import { StyleSheet, Text, View, SafeAreaView, ScrollView, Linking } from 'react-native'
import React from 'react'
import Header from '../../../component/Header'

const InfoScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>Observed data</Text>
          <Text style={styles.paragraph}>
            Observed precipitation and maximum & minimum temperatures for the 1951-2024 period at 0.25°were obtained from the India Meteorological Department (IMD) [Pai et al., 2015; Srivastava et al., 2009]. A gridded precipitation dataset has been developed using observations from more than 6500 rain gauges located across India. The daily gridded temperature dataset was developed using station-based observations from more than 300 stations located across India (Srivastava et al., 2009).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Forecasted data</Text>
          <Text style={styles.subHeading}>Short Range Forecast</Text>
          <Text style={styles.paragraph}>
            IITM developed world's highest resolution Global Ensemble Forecast System (GEFS) for short range prediction at 12 km using 21 members of the model. The GEFS prediction system provided probabilistic rainfall for next 10 days. The very high (~12 km) resolution Ensemble Prediction System (EPS) with 21 ensemble members for short range forecast system based on GEFS (T1534) has been put in place by IITM and has been handed over to IMD for operational implementation since 1 June 2018. For the benefit of IMD forecasters, various new model diagnostics and products have been developed and added based on GEFS T1534 forecast Presently the GEFS (12km) forecast is utilised to develop the block level forecast of rainfall probability for IMD's agrimet application.
          </Text>

          <Text style={styles.subHeading}>Extended Range Forecast</Text>
          <Text style={styles.paragraph}>
            Recently, with the efforts from the Ministry of Earth Sciences (MoES), operational implementation of coupled model with a suite of models from CFSv2 coupled model has been implemented in IMD during July 2016. This dynamical prediction system developed at IITM has been transferred to IMD and the same has been implemented by IMD for generating operational Extended Range Forecast products to different users. This suite of models at different resolutions with atmospheric and oceanic Initial conditions obtained from NCMRWF and INCOIS assimilation system respectively are (i) CFSv2 at T382 (≈ 38 km) (ii) CFSv2 at T126 (≈ 100 km) (iii) GFSbc (bias corrected SST from CFSv2) at T382 and (iv) GFSbc at T126.
          </Text>
          <Text style={styles.paragraph}>
            The operational suite is ported in ADITYA HPCS at IITM Pune for day-to-day operational run. The Multi-model ensemble (MME) out of the above 4 suite of models are run operationally for 32 days based on every Wednesday initial condition with 4 ensemble members (one control and 3 perturbed) each for CFSv2T382, CFSv2T126, GFSbcT382 and GFSbcT126. The same suites of model are also run on hindcast mode for 15 years (2003-2017). The average ensemble forecast anomaly of all the 4 set of model runs of 4 members each is calculated by subtracting corresponding 15-years model hindcast climatology.
          </Text>
          <Text style={styles.paragraph}>
            For the preparation of mean and anomaly forecast on every Thursday, which is valid for 4 weeks for days 2-8 (week1; Friday to Thursday), days 09-15 (week2; Friday to Thursday), days 16-22 (week3; Friday to Thursday) and days 23-29 (week4; Friday to Thursday).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Hydrologic model (VIC model)</Text>
          <Text style={styles.paragraph}>
            Land surface variables (soil moisture and runoff) were simulated using a well calibrated Variable Infiltration Capacity Model (VIC). The VIC model has been widely used in India for hydrologic assessment (Mishra et al., 2014; Mishra et al. 2018; Shah and Mishra, 2016; Shah et al. 2017; Shah and Mishra, 2016). For more information on the VIC model, please visit{' '}
            <Text 
              style={styles.link}
              onPress={() => Linking.openURL('https://vic.readthedocs.io/en/master/#variable-infiltration-capacity-vic-macroscale-hydrologic-model')}
            >
              https://vic.readthedocs.io
            </Text>
          </Text>
        </View>

        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.heading}>References</Text>
          <Text style={styles.paragraph}>
            India Meteorological Department and Indian Institute of Tropical Meteorology
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