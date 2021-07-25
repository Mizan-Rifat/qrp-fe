import { useRef, useEffect, useState } from 'react';
import Parse from 'parse';
import Pusher from 'pusher-js';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMessages } from 'redux/ducks/messagesDuck';
import { receiveMessage } from 'redux/ducks/messagesDuck';
import { contactsUpdated, setPresenceStatus } from 'redux/ducks/contactsDuck';
import { getChannelName } from 'utils';
import { resetMessagesState } from 'redux/ducks/messagesDuck';
import { loadMoreMessages } from 'redux/ducks/messagesDuck';

const useReciever = rid => {
  const currentUser = Parse.User.current();
  const Messages = Parse.Object.extend('Messages');

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

  const [channel, setChannel] = useState({});
  const [receiver, setReceiver] = useState({});
  const [events, setEvents] = useState({});
  const [newMessage, setNewMessage] = useState(false);
  const dispatch = useDispatch();

  useEffect(async () => {
    if (rid !== '') {
      dispatch(fetchMessages(rid, 1)).catch(err => {});
      const cha = await pusher.subscribe(`private-${channelName}`);
      setChannel(cha);
      const rec = await userQuery.get(rid);
      setReceiver(rec);
    }
  }, [rid]);

  useEffect(() => {
    dispatch(resetMessagesState());
  }, [rid]);

  useEffect(() => {
    if (channel.name) {
      channel.bind('incomingMessage', async data => {
        console.log({ data });
        if (data.messageFrom.objectId !== uid) {
          // const incomingMsg = await new Parse.Query(Messages).get(data.objectId);
          setNewMessage(true);
          dispatch(receiveMessage({ id: data.objectId, ...data }));
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
        console.log({ data });
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
    events,
    newMessage,
    setNewMessage
  };
};

export default useReciever;
