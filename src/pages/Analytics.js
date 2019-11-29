import React, { Component } from 'react';
import Main from './Main';
import CarparkService from '../services/CarparkService'
import * as d3 from 'd3'


import * as CanvasJSReact from '../components/canvasjs.react'
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.default.CanvasJS;
var CanvasJSChart = CanvasJSReact.default.CanvasJSChart;


const datalist = []

const csv = require('csvtojson')

export default class Analytics extends Component {

    constructor(props){
        super(props);

        this.state = {
            carparks: [],
            loading: true
        }
    }

    componentDidMount() {
       CarparkService.allCaparks().then((result) => {
            // this.setState({})
            const arr = result.data.sort(function (a, b) {
                return b.likes - a.likes;
            })

            const top5_carparks = arr.map((carpark) => {
                return {
                    likes: carpark.likes,
                    address: carpark.address
                }
            }).slice(0, 5);

            this.setState({
                carparks: top5_carparks,
                loading: false
            })
        });
    }

    render() {

        const { carparks } = this.state;

        const top5 = carparks.map((carpark => {
            return {
                y: carpark.likes,
                label: carpark.address
            }
        }))

        console.log(this.state.carparks)

        const options = {
            animationEnabled: true,
            theme: "light2",
            title: {
                text: "Most Popular Carparks (By likes)"
            },
            axisX: {
                title: "Location",
                reversed: true,
                interval: 1
            },
            axisY: {
                title: "Number of likes",
                labelFormatter: this.addSymbols
            },
            data: [{
                type: "bar",
                dataPoints: top5

            }]
        }
        return (
            <Main>
                <div>
                    {this.state.carparks ?

                    <CanvasJSChart options={options}
                    /> : null
                     }
                </div>
            </Main>

        );
    }
    addSymbols(e) {
        var suffixes = ["",];
        var order = Math.max(Math.floor(Math.log(e.value) / Math.log(1000)), 0);
        if (order > suffixes.length - 1)
            order = suffixes.length - 1;
        var suffix = suffixes[order];
        return CanvasJS.formatNumber(e.value / Math.pow(1000, order)) + suffix;
    }
}
