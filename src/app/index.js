var React = require('react');

var Measure = React.createClass({
  render () {
    return <h1>Hello World</h1>
  }
});

var domEl = document.getElementById('app');
React.render(<Measure/>, domEl);
