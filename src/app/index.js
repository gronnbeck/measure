var React = require('React');

var Measure = React.createClass({
  render: function () {
    return <h1>Hello World</h1>
  }
});

var domEl = document.getElementById('app');
React.render(<Measure/>, domEl);
