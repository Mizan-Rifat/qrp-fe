import { useEffect, useState } from 'react';
import Parse from 'parse';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import { setPresenceStatus } from 'redux/ducks/contactsDuck';

const usePresence = () => {
  const currentUser = Parse.User.current();
  const uid = currentUser.id;

  const pusher = new Pusher('6e894e9b27c3993c4068', {
    authEndpoint: 'https://qrps.app/parse/pusher/auth',
    authEndpoint: 'http://127.0.0.1:1337/pusher/auth',
    cluster: 'mt1',
    auth: {
      headers: {
        sessionToken: currentUser.getSessionToken()
      }
    }
  });

  const dispatch = useDispatch();

  useEffect(async () => {
    const myChannel = pusher.subscribe(`private-mychannel-${uid}`);
    const membersChannel = await pusher.subscribe(`chat-members`);

    membersChannel.bind('member_added', data => {
      console.log({ data });
      if (data.objectId !== uid) {
        dispatch(setPresenceStatus(data.user.objectId, true));
      }
    });
    membersChannel.bind('member_removed', data => {
      console.log({ data });
      if (data.objectId !== uid) {
        dispatch(setPresenceStatus(data.user.objectId, false));
      }
    });
  }, []);

  return { currentUser };
};

export default usePresence;
