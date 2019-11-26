import React from 'react';
import Main from './Main';
import VehicleCard from '../components/VehicleCard'
import {connect} from 'react-redux'
import Modal from 'react-modal';
import { Button, Card, Icon, Form, Grid, Input, Image} from 'semantic-ui-react';
import AuthService from '../services/AuthService';
import CarparkService from '../services/CarparkService';
import Matthew from "../images/matthew.png"
import VehicleService from '../services/VehicleService'



const ProfilePage = (props) => {
  const [showEdit, setShowEdit] = React.useState(false)
  const [showAdd, setShowAdd] = React.useState(false)
  const [email, setEmail] = React.useState(props.user.email)
  const [address, setAddress] = React.useState(props.user.address)
  const [vehicleNo, setVehicleNo] = React.useState('')
  const [vehicleType, setVehicleType] = React.useState('C')



  const editProfile = () => {
      AuthService.updateProfile('email', email).then((response)=> {
        console.log(response);
      })

      AuthService.updateProfile('address', address).then((response)=> {
        console.log(response);
      })
  }


  const addVehicle = () => {
    VehicleService.NewVehicle(vehicleNo, vehicleType).then((response)=> {
      console.log(response);
    })

    setShowAdd(false)
}

  return (

  <Main>
    <h1>Profile Page</h1>
    <Grid>
    <Grid.Row>
      <Grid.Column width={4}>
        <Card>
              <Image src={Matthew} wrapped ui={false} />
              <Card.Content>
                  <Card.Header >{props.user.email}</Card.Header>
                  <Card.Meta>
                    {props.user.address}
                  </Card.Meta>
                  <Card.Description>
                  </Card.Description>
              </Card.Content>
              <Card.Content extra>
                    <Button attached='left' onClick={() => setShowEdit(true) }>Edit</Button>
                    <Button attached='right' onClick={() => setShowAdd(true)}>Add vehicle</Button>
              </Card.Content>
          </Card>
        </Grid.Column>
        <VehicleCard />
        </Grid.Row>
    </Grid>


    <Modal
        isOpen={showEdit}
        onAfterOpen={setShowEdit}
        contentLabel="Test"
        onRequestClose={() => setShowEdit(false)}
        >
        <Form>
          <Form.Field>
              <Button icon onClick={() => setShowEdit(false)}>
                <Icon name='cancel' />
              </Button>
              <label>Email</label>
              <Form.Input value={email} onChange={(e) => setEmail(e.target.value)} />
              <label>Address</label>
              <Form.Input value={address} onChange={(e) => setAddress(e.target.value)} />
              <Button onClick={editProfile}>Edit Profile </Button>
          </Form.Field>
        </Form>
    </Modal>
    <Modal
          isOpen={showAdd}
          onAfterOpen={setShowAdd}
          contentLabel="Test"
        >
          <Form>
            <Form.Field>
              <Input value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} />
              <select onChange={(e) => setVehicleType(e.target.value)}>
                <option value ="C">Car</option>
                <option value ="H">Heavy Vehicle</option>
                <option value ="M">Motorcycle</option>
              </select>
              <Button onClick={addVehicle}>Add Vehicle </Button>
            </Form.Field>
          </Form>
    </Modal>

  </Main>

  );
}





const mapStateToProps = (state) => {
  return {
    user: state.user.profile
  }
}

export default connect(mapStateToProps, null)(ProfilePage);