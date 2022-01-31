import GroupIcon from '@material-ui/icons/Group';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EmailIcon from '@material-ui/icons/Email';
import FlagIcon from '@material-ui/icons/Flag';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SmsIcon from '@material-ui/icons/Sms';
import AcUnitIcon from '@material-ui/icons/AcUnit';

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
    path: '/shifts',
    name: 'Shifts',
    icon: AcUnitIcon
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
  },
  {
    path: '/sms-notification',
    name: 'SMS Notification to Pharmacists',
    icon: SmsIcon
  }
];
