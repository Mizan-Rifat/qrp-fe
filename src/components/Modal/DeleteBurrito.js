import * as React from 'react';
import { Button, Grid } from '@material-ui/core';
import { useConfirmation } from './ConfirmationService';

export const DeleteBurrito = () => {
  const confirm = useConfirmation();
  const [burritoState, changeBurritoState] = React.useState('ok');

  const tryToKill = () => {
    confirm({
      variant: 'danger',
      catchOnCancel: true,
      title: 'Are you sure you want to remove this burrito?',
      description: 'If you will remove this burrito you will regret it 😡'
    })
      .then(() => changeBurritoState('angry'))
      .catch(() => changeBurritoState('thanks'));
  };

  const burritoFromState = () => {
    switch (burritoState) {
      case 'ok':
        return 'https://as2.ftcdn.net/jpg/02/08/48/61/500_F_208486127_Hj5Zh7X976dHwxprpxFICBVRxHMdaBQi.jpg';
      case 'angry':
        return 'https://image.shutterstock.com/image-vector/angry-burrito-mascot-cartoon-style-450w-1117938758.jpg';
      case 'thanks':
        return 'https://as2.ftcdn.net/jpg/02/08/48/59/500_F_208485920_XV5XcgckgImOw0b7KRDAmPg0PMsXN5rl.jpg';
    }
  };

  return (
    <Grid container alignItems="center" direction="column">
      <img width={200} height={200} alt="burrito" src={burritoFromState()} />

      <Button onClick={tryToKill}> Delete burrito </Button>
    </Grid>
  );
};
