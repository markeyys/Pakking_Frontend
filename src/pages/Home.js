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

        this.state = {
          userLocation: {
            lat: 59.55,
            lng: 30.33
          },
          loading: true,
          zoom: 15,
          carparks: []
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



      componentDidMount(props){

        this.getCarparks();

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

      return (
          <Main>
             <div style={{ height: '100vh', width: '100%' }}>

                <Map google={this.props.google} zoom={15}>

                    {this.state.carparks.map(carpark => (
                      <Marker position = {{lat: carpark.lat, lng: carpark.long }} />
                    ))}

                </Map>



                {/* <GoogleMapReact
                  bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLEAPI }}
                  defaultCenter={userLocation}
                  defaultZoom={zoom}
                >
                  {this.state.carparks.map(carpark => (
                      <GoogleMapReact.Marker
                        title={carpark.address}
                        name={carpark.address}
                        position={{ lat: carpark.lat, lng: carpark.long }}
                      />
                  ))}



                </GoogleMapReact> */}

            </div>
          </Main>
      )
    }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLEAPI)
})(HomePage)