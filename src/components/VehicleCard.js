import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Button, Card, Grid, Image } from 'semantic-ui-react'
import VehicleService from '../services/VehicleService';
import Car from "../images/car.jpeg";
import Motor from "../images/motor.jpeg";
import Heavy from "../images/heavy.jpg";



class VehicleCard extends React.Component{
    constructor(props){
        super(props);
        this.state={
            vehicles: [],
            showDelModal: false,
            vehicleno: ""

        }

        this.handleODelModal = this.handleODelModal.bind(this);
        this.handleCDelModal = this.handleCDelModal.bind(this);
    }
    componentDidMount(){
        this.getAll();
    }

    getAll(){
        VehicleService.AllVehicles()
        .then(res => {
            const vehicles = res.data
            this.setState({
                vehicles: vehicles
            })
        })
    }

    /********* PROFILE ************/
    handleODelModal () {
        this.setState({ showDelModal: true });
    }

    handleCDelModal () {
        this.setState({ showDelModal: false });
    }

    handleDelChange = (event) => {
    const vehicleno = event.target.value
    this.setState({ vehicleno: vehicleno })
    }

    onDeleteVeh = (vehicleno) => () => {
        VehicleService.DeleteVehicle(vehicleno)
        .then(res => {
            window.location.reload();
        })
    }

    onMainVeh = (vehicleno) => () => {
        VehicleService.setMainVehicle(vehicleno)
        .then(res => {
            window.location.reload();
        })
    }

    render(){
        return this.state.vehicles.map((vehicle, i) => {
            let picture;
            console.log(vehicle.type);
            if(vehicle.type === 'C'){
                picture = Car;
            }
            else if(vehicle.type === 'M'){
                picture = Motor;
            }
            else if(vehicle.type === 'H'){
                picture = Heavy;
            }

        return <Grid.Column width={4} key={i}>
                    <Card>
                        <Image src={picture} wrapped ui={false} />
                        <Card.Content>
                            <Card.Header >{vehicle.vehicleno}</Card.Header>
                            <Card.Meta>
                            {vehicle.type}
                            </Card.Meta>
                            <Card.Description>
                                {vehicle.main ? 'Main Vehicle' : ''}
                            </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                             <Button attached='left'onClick={this.onMainVeh(vehicle.vehicleno)}>Set as Main</Button>
                             <Button attached='right' onClick={this.onDeleteVeh(vehicle.vehicleno)}>Delete</Button>
                        </Card.Content>
                    </Card>
                </Grid.Column>
            }

            );
    }
}
export default VehicleCard