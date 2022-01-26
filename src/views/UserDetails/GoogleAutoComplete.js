import React from 'react';
import { InputAdornment, TextField } from '@material-ui/core';
import { usePlacesWidget } from 'react-google-autocomplete';
import LocationOnOutlinedIcon from '@material-ui/icons/LocationOnOutlined';

const GoogleAutoComplete = ({ setFormData }) => {
  const { ref } = usePlacesWidget({
    apiKey: 'AIzaSyDQlMDmtfECBU455cekml_oYMnKkd3DBKA',
    onPlaceSelected: place => {
      const addressComponents = {
        locality: 'city',
        administrative_area_level_1: 'province',
        postal_code: 'postalCode',
        country: 'country'
      };
      let keys = Object.keys(addressComponents);
      const address = place.address_components.reduce((acc, val) => {
        keys.forEach(key => {
          if (val.types.includes(key)) {
            acc[addressComponents[key]] = val.long_name;
            keys = keys.filter(item => item !== key);
          } else {
            acc[addressComponents[key]] = '';
          }
        });
        return acc;
      }, {});

      address.addressOne = place.name;
      address.latitude = place.geometry.location.lat();
      address.longitude = place.geometry.location.lng();
      setFormData(address);
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
};

export default GoogleAutoComplete;
