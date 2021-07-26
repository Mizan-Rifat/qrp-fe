import Person from '@material-ui/icons/Person';
import GroupIcon from '@material-ui/icons/Group';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import EmailIcon from '@material-ui/icons/Email';

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
    path: '/messages',
    name: 'Messages',
    icon: EmailIcon,
    badge: true
  }
];
