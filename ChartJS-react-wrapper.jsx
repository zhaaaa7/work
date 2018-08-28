//dependency: npm install chart.js --save
import React, { Component } from 'react';
import Chart from 'chart.js';

class ChartJS extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.log('[DidMount]');
        this.drawChart();
    }

    componentDidUpdate() {
        console.log('[CharJS-DidUpdate]',this.props,this.state);
        this.chart.config.data=this.props.data;
        this.chart.update();
    }

    componentWillUnmount() {
        console.log('[WillUnmount]');
        this.chart.destroy();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    drawChart=()=>{
        const ctx=this.element;
        const {type,data,options}=this.props;
        this.chart = new Chart(ctx, {
            type,
            data,
            options
        });
    }

    render() {
        console.log('[CharJS-render]',this.props);
        const {width=600,height=300}=this.props;
        return (
            <React.Fragment>
                <canvas 
                    width={width}
                    height={height}
                    ref={elem=>{this.element=elem}}>
                </canvas>
            </React.Fragment>
        );
    }
}


export default ChartJS;
