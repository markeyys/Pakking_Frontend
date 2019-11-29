import ReactDOM from 'react-dom';
import './index.css';
import React from 'react';
import Main from './Main';
import CarparkService from '../services/CarparkService'
import { connect } from 'react-redux';


class LandingPage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
		this.state.carparks = props.carparks
		console.log(this.state.carparks)
	}

   renderTableHeader() {

	return <React.Fragment>
		<th>carpark number</th>
		<th>Likes</th>
		<th>address</th>
		<th>Parking Duration Availability</th>
		<th>Parking Start</th>
		<th>Parking End </th>
		<th>Carpark Type</th>
		<th>HDB</th>
		<th>Delete</th>
	</React.Fragment>


   }

   renderTableData() {
      return this.state.carparks.map((carpark, index) => {
         const { carparkno, likes, address, parkingdurationavailability, parkingstart, parkingend, carparktype, hdb, lat, long } = carpark //destructuring
         return (
            <tr key={index}>
               <td>{carparkno}</td>
               <td>{likes}</td>
    		   <td>{address}</td>
    		   <td>{parkingdurationavailability.toString()}</td>
    		   <td>{parkingstart}</td>
    		   <td>{parkingend}</td>
    		   <td>{carparktype}</td>
    		   <td>{hdb.toString()}</td>
    		   <td id="c22">
		          <button id="btn2" onClick={this.delete1(index)}>Delete</button>
		       </td>
            </tr>
         )
      })
   }

   delete1(index){
   	return () => {
   		const carparkno = this.state.carparks[index].carparkno
   		try{
   			CarparkService.addFavouriteCarpark(carparkno)
			  	.then(res => {
			  	})
   		}catch(err){
   			alert(err.message);
   		}
   		const newCarparks = this.state.carparks.slice()
   		newCarparks.splice(index, 1)
	    this.setState({
	      carparks: newCarparks
	    });
   	}
   }

   render() {
      return (
         <Main>
         	{this.state.carparks ? <React.Fragment>
	            <h1 id='title'>Favourite Carpark</h1>
	            <table id='carpark'>
	               <tbody>
	                  <tr>{this.renderTableHeader()}</tr>
	                  {this.renderTableData()}
	               </tbody>
	            </table>
     		</React.Fragment>
     		: <p>No favorite carparks</p>}
         </Main>
      )
   }
}

const mapStateToProps = state => {
	return {
	  carparks: state.user.profile.favoriteCarparks,
	}
}

export default connect(mapStateToProps, null)(LandingPage)