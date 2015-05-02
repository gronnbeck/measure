var React = require('react');

var ReactGoogleMaps = require('react-googlemaps');
var GoogleMapsAPI = window.google.maps;

var Map = ReactGoogleMaps.Map;
var Marker = ReactGoogleMaps.Marker;
var OverlayView = ReactGoogleMaps.OverlayView;

var request = require('superagent');

class Coordinates {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}

class MeasureMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = { locations: [] };
  }

  componentDidMount() {
      request
        .get('/locations')
        .end((err, res) => {
          if (err) { throw Error('Could not find locations endpoint') }
          else {
            var locations = JSON.parse(res.text);
            this.setState({
              locations: locations.map(
                (l) => new Coordinates(l.latitude, l.longitude))
            });
          }
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

class Measure extends React.Component {
  render() {
    return <MeasureMap/>
  }
};

var domEl = document.getElementById('app');
React.render(<Measure/>, domEl);
