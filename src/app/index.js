var React = require('react');

var ReactGoogleMaps = require('react-googlemaps');
var GoogleMapsAPI = window.google.maps;

var Map = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var OverlayView = ReactGoogleMaps.OverlayView;

class MeasureMap extends React.Component {
  render() {
    return (
    <Map
      initialZoom={10}
      initialCenter={new GoogleMapsAPI.LatLng(-41.2864, 174.7762)}
      width={700}
      height={700}>

      <Marker
        position={new GoogleMapsAPI.LatLng(-41.2864, 174.7762)} />
    </Map>)
  }
}

class Measure extends React.Component {
  render() {
    return <MeasureMap/>
  }
};

var domEl = document.getElementById('app');
React.render(<Measure/>, domEl);
