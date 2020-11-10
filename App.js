import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View , ActivityIndicator } from 'react-native'
import * as Location from 'expo-location'
import ReloadIcon from './components/ReloadIcon'
import WeatherInfo from './components/WeatherInfo'
import UnitsPicker from './components/UnitsPicker'
import WeatherDetails from './components/WeatherDetails'
import {colors} from './utils/index'

const WEATHER_API_KEY = '3032dfffbe73403084537681a3085478';
const BASE_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather?'

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null) // constanta care probabil e declaratia mesajului de eroare de mai jos

  const [currentWeather, setCurrentWeather] = useState(null)

  const [unitsSystem, setUnitsSystem] = useState('metric') // initial temp e in grade Kelvin, si asta o transf in celsius

  useEffect(() => {
    load() //incarca codul
  }, [unitsSystem])

  async function load() {
     setCurrentWeather(null);
     setErrorMessage(null);
    try {
      let { status } = await Location.requestPermissionsAsync()   //cere utilizatorului sa acorde permisiunea de locatie

      if (status !== 'granted'){        // daca nu ii acorda accesul la locatie
        setErrorMessage('Access to location is needed to run the app')  //apare porcaria asta
        return
      }

      const location = await Location.getCurrentPositionAsync()   // dupa ce primeste verde la locatie, trebuie sa ia datele de lat si long

      const { latitude, longitude } = location.coords          // aici declara constantele de lat si long
     
      const weatherUrl = `${BASE_WEATHER_URL}lat=${latitude}&lon=${longitude}&units=${unitsSystem}&appid=${WEATHER_API_KEY}` //cere API 
      
      const response = await fetch(weatherUrl)  //raspunsul cererii

      const result = await response.json()
      
      if(response.ok){    //verific daca raspunsul primit e ok si daca da
        setCurrentWeather(result)        // afisez rezultatul
      }    else {                         //daca nu
        setErrorMessage(result.message)         // mesaj de eroare
      }
      


    } catch (error) {
      setErrorMessage(error.message); 
    }
  }
  if(currentWeather){
    
    return (
      <View style={styles.container}>
        <StatusBar style="auto" />
        <View style={styles.main}>
              <UnitsPicker unitsSystem={unitsSystem} setUnitsSystem={setUnitsSystem}/>
              <ReloadIcon load={load}/>
              <WeatherInfo currentWeather = {currentWeather} />
        </View>
        <WeatherDetails currentWeather={currentWeather} unitsSystem={unitsSystem}/>
      </View>
     )
  }  else if(errorMessage) {
          return (
            <View style={styles.container}>
              <ReloadIcon load={load}/>
              <Text style={{textAlign: 'center'}}>Ceva nu merge</Text>
              <StatusBar style="auto" />
            </View>
          )
      } else {
        return (
          <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
            <StatusBar style="auto" />
          </View>
        )
      }
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  main : {
    justifyContent: 'center',
    flex: 1,
  },
});
