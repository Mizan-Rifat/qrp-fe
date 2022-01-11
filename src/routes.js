import GroupIcon from '@material-ui/icons/Group';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EmailIcon from '@material-ui/icons/Email';
import FlagIcon from '@material-ui/icons/Flag';
import NotificationsIcon from '@material-ui/icons/Notifications';

export const navMenu = [
  {
    path: '/staffs',
    name: 'Manage Staffs',
    icon: PeopleAltIcon
  },
  {
    path: '/pharmacy-owners',
    name: 'Pharmacy Owners',
    icon: GroupIcon
  },
  {
    path: '/emergency-shift-requests',
    name: 'Emergency Shifts',
    icon: FlagIcon
  },
  {
    path: '/messages',
    name: 'Messages',
    icon: EmailIcon,
    badge: true
  },
  {
    path: '/push-notification',
    name: 'Push Notification to Owners',
    icon: NotificationsIcon
  }
];
