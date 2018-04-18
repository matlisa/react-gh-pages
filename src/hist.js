import './index.css'

import React, { Component } from 'react'
import ReactDOM from 'react-dom';

import * as d3 from "d3";
import { histogram } from 'd3-array';
import { select } from 'd3-selection';

class Histogram extends Component {

    constructor(props){
        super(props)
        this.state = {
            width: 600,
            height: 500
        }
        this.createHistogram = this.createHistogram.bind(this)
        this.measure = this.measure.bind(this)
    }
    componentWillMount() {
        window.addEventListener('resize', this.measure, false);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.measure, false);
    }

    measure() {
        let new_width = ReactDOM.findDOMNode(this).parentNode.offsetWidth
//        let new_height = ReactDOM.findDOMNode(this).parentNode.offsetHeight
        console.log(new_width)
        if(this.state.width !== new_width){
            this.setState({
              "width": new_width,
//              height: new_height,
            });
        }
    }
    componentDidMount() {
        this.createHistogram();
        this.measure();
    }
    componentDidUpdate() {
        this.updateHistogram();
        this.measure();
    }

    createHistogram() {
        const node = this.node
        console.log(this)
        const width = this.state.width
        const height = this.state.height
        const samples = this.props.quantity
        const margin = ({top: 20, right: 20, bottom: 30, left: 40})

        const x = d3.scaleLinear()
            .domain([0,1]).nice()
            .range([margin.left, width - margin.right])

        const bins = histogram()
            .domain(x.domain())
            .thresholds(x.ticks(50))
            (this.props.data);

        const y = d3.scaleLinear()
            .domain([0,d3.max(bins, d => d.length/samples)]).nice()
            .range([height - margin.bottom, margin.top])

        var xAxis = g => g
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
            .call(g => g.append("text")
            .attr("x", width - margin.right)
            .attr("y", -4)
            .attr("fill", "#000")
            .attr("font-weight", "bold")
            .attr("text-anchor", "end")
            .text(this.props.data.x))

        var yAxis = g => g
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())

        var bars = select(node).append("g")
            .attr("fill", "hsl(" + Math.random() * 360 + ",100%,50%)")
            .selectAll("rect")
            .data(bins)

        bars.enter()
            .append("rect")
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => (x(d.x1) - x(d.x0))>0 ? (x(d.x1) - x(d.x0)-1):0)
            .attr("y", y(0))
            .attr("height", 0)
            .transition()
            .duration(1000)
            .attr("y", d => y(d.length/samples))
            .attr("height", d => y(0) - y(d.length/samples));

        select(node).append("g")
            .call(xAxis);

        select(node).append("g")
            .call(yAxis);
    }

    updateHistogram() {
        const node = this.node
        const width = this.state.width
        const height = this.state.height
        const samples = this.props.quantity
        const margin = ({top: 20, right: 20, bottom: 30, left: 40})

        const x = d3.scaleLinear()
            .domain([0,1]).nice()
            .range([margin.left, width - margin.right])

        const bins = histogram()
            .domain(x.domain())
            .thresholds(x.ticks(50))
            (this.props.data);

        const y = d3.scaleLinear()
            .domain([0,d3.max(bins, d => d.length/samples)]).nice()
            .range([height - margin.bottom, margin.top])

        var xAxis = g => g
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSizeOuter(0))
//            .call(g => g.append("text")
//            .attr("x", width - margin.right)
//            .attr("y", -4)
//            .attr("fill", "#000")
//            .attr("font-weight", "bold")
//            .attr("text-anchor", "end")
//            .text(this.props.data.x))

        var yAxis = g => g
            .attr("class", "y axis")
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(y))
            .call(g => g.select(".domain").remove())

        var bars = select(node)
            .selectAll("rect")
            .data(bins)

        bars.exit().remove()

        bars.enter()
            .append("rect")

        bars.transition()
            .duration(500)
            .attr("fill", "hsl(" + Math.random() * 360 + ",25%,75%)")
            .attr("y", d => y(d.length/samples))
            .attr("height", d => y(0) - y(d.length/samples))
            .attr("x", d => x(d.x0) + 1)
            .attr("width", d => (x(d.x1) - x(d.x0))>0 ? (x(d.x1) - x(d.x0)-1):0)

        select(node).select(".x").transition().call(xAxis)

        select(node).select(".y").transition().call(yAxis)

    }

    render() {
      return <svg ref={node => this.node = node}
      width={this.state.width} height={this.state.height}>
      </svg>
    }
}

export default Histogram