import { useRef, useEffect, useState } from 'react';
import Parse from 'parse';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import { resetMessagesState, setMessagesState } from 'redux/ducks/messagesDuck';
import { getChannelName } from 'utils';
import { setSeen } from 'redux/ducks/contactsDuck';
import { addContact } from 'redux/ducks/contactsDuck';

const useReciever = rid => {
  const currentUser = Parse.User.current();
  const uid = currentUser.id;

  const pusher = new Pusher('6e894e9b27c3993c4068', {
    // authEndpoint: 'https://qrps.app/pusher/auth',
    authEndpoint: 'http://127.0.0.1:1337/pusher/auth',
    cluster: 'mt1',
    auth: {
      headers: {
        sessionToken: currentUser.getSessionToken()
      }
    }
  });

  const User = new Parse.User();
  const userQuery = new Parse.Query(User);

  const channelName = getChannelName(uid, rid);

  const { channel, events, recipient } = useSelector(state => state.messages);
  const { contacts } = useSelector(state => state.contacts);

  const dispatch = useDispatch();

  useEffect(async () => {
    if (rid !== '') {
      const cha = await pusher.subscribe(`private-${channelName}`);
      dispatch(setMessagesState('channel', cha));
      let rec = {};
      const contact = contacts.find(contact => contact.id === rid);
      if (contact) {
        rec = contact;
      } else {
        const user = await userQuery.get(rid);
        rec = { id: user.id, ...user.attributes };
        console.log({ user });
        dispatch(addContact(rec));
      }
      console.log({ rec });
      dispatch(setMessagesState('recipient', rec));
    }
  }, [rid]);

  useEffect(() => {
    dispatch(resetMessagesState());
    return () => {
      dispatch(resetMessagesState());
      pusher.unsubscribe(`private-${channelName}`);
    };
  }, [rid]);

  useEffect(() => {
    const contact = contacts.find(contact => contact.id === rid);
    if (contact) {
      dispatch(setSeen(rid));
    }
  }, [rid]);

  useEffect(() => {
    if (channel?.name) {
      channel.bind('client-typing', function (data) {
        dispatch(setMessagesState('events', { ...events, typing: data.typing }));
      });
      channel.bind('client-not-typing', function (data) {
        dispatch(setMessagesState('events', { ...events, typing: data.typing }));
      });
    }
  }, [channel]);
};

export default useReciever;
