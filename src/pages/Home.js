import React, {useState, Component} from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import Geocoder from "react-map-gl-geocoder";
import { geolocated } from "react-geolocated";
import {Map, InfoWindow, Marker, GoogleApiWrapper, Circle} from 'google-maps-react';
import CarparkService from '../services/CarparkService';
import {  Button, Grid, Search, Label, Icon} from 'semantic-ui-react'



class InfoWindowEx extends Component {
  constructor(props) {
    super(props);
    this.infoWindowRef = React.createRef();
    this.contentElement = document.createElement(`div`);
  }

  componentDidUpdate(prevProps) {
    if (this.props.children !== prevProps.children) {
      ReactDOM.render(
        React.Children.only(this.props.children),
        this.contentElement
      );
      this.infoWindowRef.current.infowindow.setContent(this.contentElement);
    }
  }

  render() {
    return <InfoWindow ref={this.infoWindowRef} {...this.props} />;
  }
}

class HomePage extends Component {

      constructor(props){

        super(props);

        this.state = {
          userLocation: {
            lat: 1.3775334,
            lng: 103.8486928
          },
          loading: true,
          zoom: 15,
          carparks: [],
          selectedCarpark: 0,
          showingInfoWindow: false,
          activeMarker: {},
          result: [],
          displayCircle: false,
          circle_coords : {
            lat: 0,
            lng: 0
          },
          searchLoading: false,
          searchResults: [],
          searchValue: ''
        }
      }


     async getCarparks(){
          const carpark_response = await CarparkService.allCaparks();
          console.log(carpark_response);
          const carparks = carpark_response.data;
          console.log(carparks);
          this.setState({
            carparks: carparks,
            loading: false
          })
    }


    onMarkerClick = (props, marker, e) =>{

      console.log(props);
      this.setState({
        selectedCarpark: props.index,
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


  withinProximity(checkPoint, centerPoint, km){

    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.long - checkPoint.long) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;

  }

  getCarparksNearby(coords){

    const user_location = {
      lat: coords.lat,
      long: coords.lng
    }

    return () => {

      const carparks = this.state.carparks.filter((carpark) => {
        const carpark_coords = {
          lat: carpark.lat,
          long: carpark.long
        }
        return this.withinProximity(carpark_coords, user_location, 2)
    })

      this.setState({
        displayCircle: true,
        result: carparks,
        circle_coords: coords
      })
    }

  }







  favouriteCarpark(index){
    return () => {
      const carpark = this.state.carparks[index];
      CarparkService.addFavouriteCarpark(carpark.carparkno).then(response => {
        console.log(response);
      })
    }

  }

  likeCarpark(index){
    return () => {
      const carpark = this.state.carparks[index];
      CarparkService.likeCarpark(carpark.carparkno).then(response => {
        const new_carpark = this.state.carparks.slice()
        if (response.data.liked){
          new_carpark[index] = {
            ...carpark,likes: carpark.likes + 1}
        }else {
          new_carpark[index] = {
            ...carpark,likes: carpark.likes - 1}
        }

       this.setState({
         carparks: new_carpark
       })


      })
    }

  }



    async componentDidMount(){

      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          console.log(latitude);
          console.log(longitude)
          this.setState({
            userLocation: { lat: latitude, lng: longitude }
          });
        }
      );

      await this.getCarparks();
    }


    renderMarker(){
     this.markers ={}


    return this.state.carparks.map((carpark, index) => (
        <Marker
        ref = {(ref ) => this.markers[index] = ref}
        index={index}
        onClick={this.onMarkerClick}
        position = {{lat: carpark.lat, lng: carpark.long }}
        pinColor={'blue'}
        />
      ))
    }


    handleResultSelect = (e, { result }) => {


        const display_carpark = this.state.carparks.filter((carpark) => {
          return carpark.carparkno === result.carparkno
        })
        const index = this.state.carparks.indexOf(display_carpark[0]);
        console.log(this.markers[index]);

        this.maps.props.google.maps.event.trigger(this.markers[index].marker, 'click' );


        this.setState({
          userLocation: {
            lat: result.lat,
            lng: result.long
          }
        })

    }

    handleSearchChange = (e, { value }) => {
      this.setState({ searchLoading: true, searchValue: value })

      setTimeout(() => {


        if (this.state.searchValue.length < 1) return
        CarparkService.searchByAddress(value).then((results) => {
          const search_results = results.data.map((result) => {

            let parkingStart = result.parkingstart.toString()
            let parkingEnd = result.parkingend.toString()
            if (parkingStart.length < 4){
              parkingStart = '0' + parkingStart
            }

            if (parkingEnd.length < 4){
              parkingEnd = '0' + parkingEnd
            }

            let type = 'HDB';
            if (!result.hdb){
              type = 'URA'
            }

            const description = `${type} Carpark. Time: ${ parkingStart } - ${parkingEnd} `
            return {...result, title: result.address, description: description}
          })

          this.setState({
            searchLoading: false,
            searchResults: search_results.slice(0, 5)
          })

        })



      }, 300)
    }




    render(){

      // console.log(this.state.carparks);
      const { searchLoading, searchResults, searchValue, displayCircle, userLocation, zoom, loading, carparks, selectedCarpark, circle_coords } = this.state;

      if (loading){
          return null;
      }

      const selectedCP = carparks[selectedCarpark]

      return (
          <Main>
             <div style={{ height: '100vh', width: '100%', position: 'relative'}}>


                <Grid>
                  <Grid.Row width={12}>
                          <Search
                            loading={searchLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={this.handleSearchChange}
                            results={searchResults}
                            value={searchValue}
                            {...this.props}
                            input={{ fluid: true }}
                            style={{justifyContent: 'center', alignItens: 'center', width: '100%', padding: 10}}
                          />
                  </Grid.Row>
                </Grid>

                <Button onClick={this.getCarparksNearby(userLocation)}  basic color='red'>Get Current Location</Button>
                <Map google={this.props.google} zoom={20} center={{
                  lat: userLocation.lat,
                  lng: userLocation.lng
                }} onClick={this.onMapClicked}
                ref = {(ref) => this.maps = ref}
                style={{width: '100%', height: '100%', position: 'relative', justifyContent: 'center', alignItens: 'center'}}>

                { displayCircle ?
                  <Circle
                      radius={2000}
                      center={circle_coords}
                      strokeColor='transparent'
                      strokeOpacity={0}
                      strokeWeight={5}
                      fillColor='#FF0000'
                      fillOpacity={0.2}
                  /> : null }

                    {this.renderMarker()}

                    <InfoWindow
                      marker={this.state.activeMarker}
                      visible={this.state.showingInfoWindow}>
                        <div>
                          <h1>{selectedCP.address}</h1>
                          <Label>
                            <Icon name='thumbs up'/> {selectedCP.likes}
                          </Label>

                          <h2>Lots: {selectedCP.availability.lotsavailable ? selectedCP.availability.lotsavailable : 0}/
                          {selectedCP.availability.totallots}</h2>
                          <Button onClick={this.likeCarpark(selectedCarpark)} icon primary>
                            <Icon name='heart' />
                          Like</Button>
                          <Button onClick={this.favouriteCarpark(selectedCarpark)} icon secondary> <Icon name='add' />Favourite Carpark</Button>
                        </div>
                    </InfoWindow>



                </Map>




            </div>
          </Main>
      )
    }
}


export default GoogleApiWrapper({
  apiKey: process.env.REACT_APP_GOOGLEAPI
})(HomePage)
