var React = require('react');
var MeasureMap = require('./components/measure-map');

class Measure extends React.Component {
  render() {
    return <MeasureMap/>
  }
};

var domEl = document.getElementById('app');
React.render(<Measure/>, domEl);
