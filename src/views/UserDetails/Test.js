import React, { useRef, useState } from 'react';
import { Input, InputAdornment, TextField } from '@material-ui/core';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

function App() {
  const inputRef = useRef(null);
  const antInputRef = useRef(null);
  const [country, setCountry] = useState('ca');
  const { ref: materialRef } = usePlacesWidget({
    apiKey: 'AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA',
    onPlaceSelected: place => {
      console.log(place);
      console.log(place.geometry.location.lat());
      console.log(place.geometry.location.lng());
      // place.address_components.reduce(())
    },
    // inputAutocompleteValue: 'country',
    // options: {
    //   componentRestrictions: { country },
    //   fields: ['formatted_address', 'geometry', 'name']
    // }
    options: {
      fields: ['address_components', 'formatted_address', 'geometry.location', 'name'],
      // fields: ['ALL'],
      types: ['address'],
      componentRestrictions: { country: 'ca' }
    }
  });

  return (
    // <div style={{ width: '250px', marginTop: '20px' }}>
    <TextField
      label="Search Location"
      // className={classes.textField}
      style={{ marginBottom: 16 }}
      size="small"
      variant="outlined"
      fullWidth
      inputRef={materialRef}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnOutlinedIcon />
          </InputAdornment>
        )
      }}
    />
    // </div>
  );
}

export default App;
