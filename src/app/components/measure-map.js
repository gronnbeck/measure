var React = require('react');
var ReactGoogleMaps = require('react-googlemaps');
var GoogleMapsAPI = window.google.maps;
var Map = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;

var Coordinates = require('../models/coordinates');
var LocationsQuery = require('../services/locations-query');

class MeasureMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  componentDidMount() {
    var query = new LocationsQuery();
    query.query((locations) => {
      this.setState({
        locations: locations.map(
          (l) => new Coordinates(l.latitude, l.longitude))
      });
    });
  }

  render() {
    const locations = this.state.locations;
    const center = locations.length > 0 ?
      locations[0] : new Coordinates(0, 0);
    const markers = locations.map(
      (l) => <Marker
        position={new GoogleMapsAPI.LatLng(l.lat, l.lng)} />);
    return (
    <Map
      initialZoom={3}
      initialCenter={new GoogleMapsAPI.LatLng(center.lat, center.lng)}
      width={700}
      height={700}>
        {markers}
    </Map>)
  }
}

module.exports = MeasureMap;
