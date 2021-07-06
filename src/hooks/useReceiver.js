import { useRef, useEffect, useState } from 'react';
import Parse from 'parse';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from 'redux/ducks/messagesDuck';
import { receiveMessage } from 'redux/ducks/messagesDuck';
import { contactsUpdated, setPresenceStatus } from 'redux/ducks/contactsDuck';
import { getChannelName } from 'utils';

const useReciever = rid => {
  const currentUser = Parse.User.current();
  const Messages = Parse.Object.extend('Messages');

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

  const User = new Parse.User();
  const userQuery = new Parse.Query(User);

  const channelName = getChannelName(uid, rid);

  const [channel, setChannel] = useState({});
  const [receiver, setReceiver] = useState({});
  const [events, setEvents] = useState({});
  const dispatch = useDispatch();

  useEffect(async () => {
    if (rid !== '') {
      dispatch(fetchMessages(rid));
      const cha = await pusher.subscribe(`private-${channelName}`);
      setChannel(cha);
      const rec = await userQuery.get(rid);
      setReceiver(rec);
    }
  }, [rid]);

  useEffect(() => {
    if (channel.name) {
      channel.bind('incomingMessage', async data => {
        console.log(data.messageFrom.objectId);
        if (data.messageFrom.objectId !== uid) {
          const incomingMsg = await new Parse.Query(Messages).get(data.objectId);
          console.log({ incomingMsg });
          dispatch(receiveMessage(incomingMsg));
        }
      });
      channel.bind('client-typing', function (data) {
        console.log({ data });
        setEvents({
          ...events,
          ...data
        });
      });
      channel.bind('client-not-typing', function (data) {
        setEvents({
          ...events,
          ...data
        });
      });
    }
  }, [channel]);

  return {
    receiver,
    channel,
    events
  };
};

export default useReciever;
