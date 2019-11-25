import React, {useState, Component} from 'react';
import Main from './Main';
import Geocoder from "react-map-gl-geocoder";
import { geolocated } from "react-geolocated";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import CarparkService from '../services/CarparkService';

const AnyReactComponent = ({ text }) => <div>{text}</div>;


class HomePage extends Component {

      constructor(props){

        super(props);
        console.log('test')

        this.state = {
          userLocation: {
            lat: 59.55,
            lng: 30.33
          },
          loading: false,
          zoom: 15,
          carparks: [],
          selectedCarpark: {},
          showingInfoWindow: false,
          activeMarker: {}
        }
      }


     async getCarparks(){
          const carpark_response = await CarparkService.allCaparks();
          const carparks = carpark_response.data;
          console.log(carparks);
          this.setState({
            carparks: carparks
          })
    }


    onMarkerClick = (props, marker, e) =>{

      console.log(props);
      this.setState({
        selectedCarpark: props,
        activeMarker: marker,
        showingInfoWindow: true
      });
    }


    onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };



      async componentDidMount(){


        await this.getCarparks()

        navigator.geolocation.getCurrentPosition(
          position => {
            const { latitude, longitude } = position.coords;
            console.log(latitude);
            console.log(longitude)
            this.setState({
              userLocation: { lat: latitude, lng: longitude }
            },
            () => {
              this.setState({ loading: false });
            });
          }
        );
      }




    render(){

      // console.log(this.state.carparks);
      const { userLocation, zoom, loading } = this.state;

      console.log(userLocation);

      return (
          <Main>
             <div style={{ height: '100vh', width: '100%' }}>

                <Map google={this.props.google} zoom={20} center={{
                  lat: userLocation.lat,
                  lng: userLocation.lng
                }} onClick={this.onMapClicked}>

                    {this.state.carparks.map(carpark => (
                      <Marker
                      key = {carpark.carparkNo}
                      title = {carpark.address}
                      parkingStart= {{start: carpark.parkingStart, end: carpark.parkingEnd}}
                      onClick={this.onMarkerClick}
                      position = {{lat: carpark.lat, lng: carpark.long }} />
                    ))}

                    <InfoWindow
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}>
                        <div>
                          <h4>{this.state.selectedCarpark.title}</h4>
                        </div>
                    </InfoWindow>

                </Map>


            </div>
          </Main>
      )
    }
}


const LoadingContainer = (props) => (
  <div>Fancy loading container!</div>
)

export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEAPI
})(HomePage)