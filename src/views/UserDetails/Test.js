import React, { useRef, useState } from 'react';
import { Input, InputAdornment, TextField } from '@material-ui/core';
import Autocomplete, { usePlacesWidget } from 'react-google-autocomplete';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

function App({ formData, setFormData }) {
  const { ref } = usePlacesWidget({
    apiKey: 'AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA',
    onPlaceSelected: place => {
      console.log({ place });
      const addressComponents = {
        locality: 'city',
        administrative_area_level_1: 'province',
        postal_code: 'postalCode',
        country: 'country'
      };
      const address = place.address_components.reduce((acc, val) => {
        Object.keys(addressComponents).forEach(item => {
          const founds = [];
          if (val.types.indexOf(item) !== -1) {
            acc[addressComponents[item]] = val.long_name;
            founds.push(item);
          } else {
            if (!founds.includes('item')) {
              acc[addressComponents[item]] = '';
            }
          }
        });
        return acc;
      }, {});
      // const address = addressComponents.reduce((acc, val) => {
      //   place.address_components.forEach(component => {
      //     if (component.types.indexOf(val) !== -1) {
      //       acc[addressComponents[item]] = val.long_name;
      //     } else {
      //       acc[addressComponents[val]] = '';
      //     }
      //   });
      //   return acc;
      // }, {});

      // const address = {};

      // place.address_components.forEach(val => {
      //   Object.keys(addressComponents).forEach(item => {
      //     if (val.types.indexOf(item) !== -1) {
      //       address = val.long_name;
      //     } else {
      //       acc[addressComponents[val]] = '';
      //     }
      //   });
      //   return acc;
      // }, {});

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
