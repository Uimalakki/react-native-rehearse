/* eslint-disable prettier/prettier */
import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Platform } from 'react-native';
import helper from '../utils/helper.js';
import LocationButton from './LocationButton.js';
import WeatherButton from './WeatherButton.js';
import { addCatch } from '../services/Database.js';
import axios from 'axios';

const baseUrl = 'https://stormy-escarpment-48173.herokuapp.com/api/catches';

class AddForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      catch: {
        date: Date.now(),
        coordinates: {
          latitude: 999,
          longitude: 999,
        },
        weather: {
          temperature: 0,
          description: 'n/a',
          wind: 0,
          icon: 'n/a',
        },
      },
    };
  }

  handleSpeciesInput = (text) => {
    let newCatch = this.state.catch;
    newCatch.species = text;
    this.setState({ catch: newCatch });
  }

  handleWeightInput = (text) => {
    let newCatch = this.state.catch;
    newCatch.weight = Number(text);
    this.setState({ catch: newCatch });
  }

  handleAddNewCatch = async () => {
    let newCatch = this.state.catch;
    newCatch.id = helper.uniqueID();
    this.setState({ catch: newCatch });
    this.props.addCatch(oldCatches => [...oldCatches, newCatch]);
    await addCatch(this.state.catch);
  }

  addCatchToDB = async () => {
    if (this.state.catch.species === undefined || this.state.catch.weight === undefined) {
      this.props.setMessage('species and weight fields must be populated!');
    } else {
      let newCatch = this.state.catch;
      if (!newCatch.coordinates) {

      }
      /*newCatch.id = helper.uniqueID();
      this.setState({ catch: newCatch });
      await addCatch(this.state.catch);*/
      axios.post(baseUrl, newCatch).then(response => {
        console.log(response.data);
      });
    }
  }

  checkInputFields = () => {
    if (!this.state.species) {
      this.props.setMessage('species field must be populated!');
      return false;
    }
    if (!this.state.weight) {
      this.props.setMessage('weight field must be populated!');
      return false;
    }
    return true;
  }

  handleLocating = async (coordinatesObject) => {
    let newCatch = this.state.catch;
    newCatch.coordinates = {
      latitude: coordinatesObject.latitude,
      longitude: coordinatesObject.longitude,
    };
    console.log('addFrom handleLoccating' + JSON.stringify(newCatch.coordinates));

    this.setState({ catch: newCatch });
  }

  handleWeatherInfo = (weatherObject) => {
    if (!this.props.apiKey) {
      this.props.setModalViewVisible(true);
    } else {
      console.log('AddForm.handleWeatherInfo ' + JSON.stringify(weatherObject));
      let newCatch = this.state.catch;
      newCatch.weather = {
        temperature: weatherObject.main.temp,
        description: weatherObject.weather[0].description,
        wind: weatherObject.wind.speed,
        icon: weatherObject.weather[0].icon,
      };
      this.setState({ catch: newCatch });
    }
  }

  render() {
    return (
      <View>
        <Text style={styles.header}>Add a catch</Text>
        <TextInput
          style={styles.input}
          placeholder="species"
          onChangeText={this.handleSpeciesInput}
        />
        <TextInput
          style={styles.input}
          placeholder="weight"
          onChangeText={this.handleWeightInput}
        />
        <LocationButton
          setLocation={this.handleLocating}
          style={styles.secondaryButton}
          sendNotification={this.props.setMessage}
          coordinates={this.state.catch.coordinates}
        />
        <WeatherButton
          setWeather={this.handleWeatherInfo}
          coordinates={this.state.catch.coordinates}
          style={styles.secondaryButton}
          setModalViewVisible={this.props.setModalViewVisible}
          apiKey={this.props.apiKey}
          sendNotification={this.props.setMessage}
        />
        <TouchableOpacity
          style={styles.submitButton}
          onPress={this.addCatchToDB}
        >
          <Text style={styles.submitButtonText}>Add catch</Text>
        </TouchableOpacity>
      </View >
    );
  }
}

export default AddForm;

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  input: {
    margin: 15,
    height: 40,
    borderWidth: 1,
    ...Platform.select({
      android: {
        borderColor: '#7a42f4',
      },
      ios: {
        borderColor: 'white',
      },
    }),
  },
  submitButton: {
    borderRadius: 20,
    ...Platform.select({
      android: {
        backgroundColor: '#5e639a',
        elevation: 10,
      },
      ios: {
        backgroundColor: '#5ac8fa',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  secondaryButton: {
    borderRadius: 20,
    ...Platform.select({
      android: {
        backgroundColor: '#86DAFB',
        elevation: 10,
      },
      ios: {
        backgroundColor: '#a2b7d0',
        shadowColor: 'rgb(0, 0, 0)',
        shadowOffset: {
          width: 3,
          height: 3,
        },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      },
    }),
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  header: {
    fontSize: 20,
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: 'grey',
  },
});
