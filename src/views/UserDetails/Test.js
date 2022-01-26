import React, { useRef, useState } from 'react';
import { Input, InputAdornment, TextField } from '@material-ui/core';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

function App({ formData, setFormData }) {
  const { ref } = usePlacesWidget({
    apiKey: 'AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA',
    onPlaceSelected: place => {
      console.log({ place });

      const address = {};
      place.address_components.forEach(component => {
        if (component.types.includes('locality')) {
          address.city = place.address_components.long_name;
        } else {
          address.city = '';
        }
        if (component.types.includes('administrative_area_level_1')) {
          address.province = place.address_components.long_name;
        } else {
          address.province = '';
        }
        if (component.types.includes('postal_code')) {
          address.postalCode = place.address_components.long_name;
        } else {
          address.postalCode = '';
        }
        if (component.types.includes('locality')) {
          address.country = place.address_components.long_name;
        } else {
          address.country = '';
        }
      });

      address.addressOne = place.name;
      address.latitude = place.geometry.location.lat();
      address.longitude = place.geometry.location.lng();
      console.log({ address });
      setFormData({ ...formData, ...address });
    },
    options: {
      fields: ['address_components', 'formatted_address', 'geometry.location', 'name'],
      types: ['address'],
      componentRestrictions: { country: 'ca' }
    }
  });

  return (
    <TextField
      label="Search Location"
      // className={classes.textField}
      style={{ marginBottom: 16 }}
      size="small"
      variant="outlined"
      fullWidth
      inputRef={ref}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <LocationOnOutlinedIcon />
          </InputAdornment>
        )
      }}
    />
  );
}

export default App;
