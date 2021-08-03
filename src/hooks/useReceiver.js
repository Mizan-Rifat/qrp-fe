import { useRef, useEffect, useState } from 'react';
import Parse from 'parse';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchMessages,
  receiveMessage,
  resetMessagesState,
  loadMoreMessages,
  setMessagesState
} from 'redux/ducks/messagesDuck';
import { contactsUpdated, setPresenceStatus } from 'redux/ducks/contactsDuck';
import { getChannelName } from 'utils';
import { setSeen } from 'redux/ducks/contactsDuck';

const useReciever = rid => {
  const currentUser = Parse.User.current();

  const uid = currentUser.id;

  const pusher = new Pusher('6e894e9b27c3993c4068', {
    authEndpoint: 'https://qrps.app/pusher/auth',
    // authEndpoint: 'http://127.0.0.1:1337/pusher/auth',
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

  const dispatch = useDispatch();

  useEffect(async () => {
    if (rid !== '') {
      const cha = await pusher.subscribe(`private-${channelName}`);
      dispatch(setMessagesState('channel', cha));
      const rec = await userQuery.get(rid);
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
    if (channel?.name) {
      channel.bind('incomingMessage', async data => {
        if (data.messageFrom.objectId !== uid) {
          if (data.messageFrom.objectId === rid) {
            dispatch(setMessagesState('events', { ...events, newMessage: true }));
            dispatch(setSeen(rid));
            dispatch(receiveMessage({ id: data.objectId, ...data }));
          }
        }
      });
      channel.bind('client-typing', function (data) {
        dispatch(setMessagesState('events', { ...events, typing: data.typing }));
      });
      channel.bind('client-not-typing', function (data) {
        dispatch(setMessagesState('events', { ...events, typing: data.typing }));
      });
    }
  }, [channel]);

  useEffect(() => {
    dispatch(setSeen(rid));
  }, [rid]);
};

export default useReciever;
