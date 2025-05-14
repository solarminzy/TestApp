// PatientTrackerScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Button, TouchableOpacity, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PatientTrackerScreen = () => {
  const [patientState, setPatientState] = useState(null);

  const defaultPatient = {
    patientName: "John Doe",
    secureNumber: "TX52487915JD",
    ScheduleTime: [
      { day: "monday", hour: "10:30", taken: false },
      { day: "tuesday", hour: "11:20", taken: false },
      { day: "wednesday", hour: "13:00", taken: false },
      { day: "thursday", hour: "14:00", taken: true },
      { day: "friday", hour: "08:00", taken: true },
      { day: "saturday", hour: "09:00", taken: false },
      { day: "sunday", hour: "12:00", taken: false }
    ],
    History: "The patient reports that while working on a construction site, he slipped and fell from a height of approximately 1.5 meters, landing directly on his right arm. He experienced immediate, sharp pain in the arm, accompanied by swelling and an inability to move it. There was no loss of consciousness or other apparent injuries.",
    Medicine: "ibuprofen",
    token: "QWERTY1234"
  };

  const patientToken = "QWERTY1234";

  const loadPatientData = async () => {
    try {
      const saved = await AsyncStorage.getItem('patientState');
      if (saved) {
        setPatientState(JSON.parse(saved));
      } else {
        await AsyncStorage.setItem('patientState', JSON.stringify(defaultPatient));
        setPatientState(defaultPatient);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  const validatePatient = () => {
    if (patientState?.token === patientToken) {
      console.log("Patient autentication Correct");
    } else {
      throw new Error("Patient autentication Failed");
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    const loadData = async () => {
      const saved = await AsyncStorage.getItem('patientState');
      if (saved) {
        setPatientState(JSON.parse(saved));
      } else {
        await AsyncStorage.setItem('patientState', JSON.stringify(defaultPatient));
        setPatientState(defaultPatient);
      }
    };
    loadData();
  }, []);

  // Guardar automáticamente cada vez que cambia
  useEffect(() => {
    const saveData = async () => {
      if (patientState) {
        await AsyncStorage.setItem('patientState', JSON.stringify(patientState));
      }
    };
    saveData();
  }, [patientState]);



  // Ejemplo: cambiar estado de dos
  const markDoseAsTaken = (dayIndex) => {
    const updated = [...patientState.ScheduleTime];
    updated[dayIndex].taken = !updated[dayIndex].taken;
    setPatientState({ ...patientState, ScheduleTime: updated });
  };

  if (!patientState) return <Text>Loading...</Text>;

  const missingDoses = patientState.ScheduleTime.filter(d => !d.taken);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center', alignItems: 'center' }} >
        <View style={styles.card}>
          <Text style={styles.name}>{patientState.patientName}</Text>
          <Text style={styles.secureNumber}>ID: {patientState.secureNumber}</Text>
        </View>

        <View style={styles.cardHistory}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 }}>📋 History:</Text>
          <View>
            <Text style={{ fontSize: 15, paddingHorizontal: 10, textAlign: 'justify' }}>{patientState.History}</Text>
          </View>
        </View>

        <View style={styles.cardDays}>
          <View style={{ width: '100%', flexDirection: 'row' }}>
            <View style={{ width: '50%', height: '100%' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', paddingHorizontal: 10 }}>📋 Weekly Doses:</Text>
            </View>
            <View style={{ width: '50%', height: '100%', maxHeight: 35, justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, paddingHorizontal: 10, textAlign: 'justify', opacity: 0.5 }}>Press the X or the Thick</Text>
            </View>
          </View>
          <View>
            {patientState.ScheduleTime.map((entry, index) => (
              <View key={index} style={{ marginTop: 10, width: '100%', flexDirection: 'row' }}>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>{entry.day}</Text>
                </View>
                <View style={{ width: '33%' }}>
                  <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>{entry.hour}</Text>
                </View>
                <View style={{ width: '33%' }}>

                  <TouchableOpacity onPress={() => markDoseAsTaken(index)}>
                    <Text style={{ fontSize: 15, textAlign: 'center', fontWeight: 'bold' }}>
                      {entry.taken ? "✅" : "❌"}
                    </Text>
                  </TouchableOpacity>

                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
   marginTop: 40,
    width: '100%',
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginTop: 10,
    width: '95%',
    height: 80,
    shadowColor: '#FFFF',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardDays: {
    width: "95%",
     height: 260,
    borderRadius: 15,
    justifyContent: 'center', 
    backgroundColor: '#FFFF',
    shadowColor: '#FFFF',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center' 
  },
    cardHistory: {
    width: "95%",
     height: 200,
    borderRadius: 15,
    justifyContent: 'center', 
    backgroundColor: '#FFFF',
    shadowColor: '#FFFF',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 10,
    justifyContent: 'center',
    marginBottom: 10
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  secureNumber: {
    fontSize: 16,
    color: '#666'
  },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { marginTop: 20, fontWeight: 'bold' }
});

export default PatientTrackerScreen;
