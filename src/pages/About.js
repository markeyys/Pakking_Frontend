import ReactDOM from 'react-dom';
import './index.css';
import React from 'react';
import Main from './Main';
import CarparkService from '../services/CarparkService'
import { connect } from 'react-redux';

// const LandingPage = () => (
//   <Main>
    
//   </Main>
// )

class LandingPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
		this.state.carparks = props.carparks
		console.log(this.state.carparks)
	}

   renderTableHeader() {
      let header = Object.keys(this.state.carparks[0])
      return header.map((key, index) => {
         return <th key={index}>{key.toUpperCase()}</th>
      })
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
    		   <td>{lat}</td>
    		   <td>{long}</td>
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
			  		// const carparks = res.data
			  		// console.log(carparks)
			  	})
   		}catch(err){
   			alert(err.message);
   		}
   		//document.getElementById('carpark').deleteRow(index)
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
         	{this.state.carparks.length > 0 ? <React.Fragment>
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
	//console.log(state.user)
	return {
	  carparks: state.user.profile.favoriteCarparks,
	}
}

export default connect(mapStateToProps, null)(LandingPage)