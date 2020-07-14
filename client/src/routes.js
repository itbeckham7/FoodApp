import { Account, AccountMultiple, Home, Cart, TextBoxCheck, Contacts, Login, Logout, Newspaper } from 'mdi-material-ui';
import UserList from './containers/Users/UserList';
import Profile from './containers/Auth/Profile';
import HomePage from './containers/Home/Home';
import FoodsPage from './containers/Home/Foods';
import FoodPage from './containers/Home/Food';
import Order from './containers/Order/Order';
import Bag from './containers/Bag/Bag';
import AboutUs from './containers/AboutUs/AboutUs';

const routeCategories = [
  {
    id: 'manage',
    name: 'Manage',
    isHidden: false,
    routes: [
      {
        id: 'users',
        name: 'Users',
        path: '/dashboard/users',
        isHidden: false,
        component: UserList,
        permissions: ['userInsert', 'userRead', 'userModify'],
        requiresAny: false,
        icon: AccountMultiple,
      },
    ],
  },
  {
    id: 'home',
    name: 'Home Menu',
    isHidden: false,
    routes: [
      {
        id: 'home',
        name: 'Home',
        title: 'Fast Food',
        path: '/dashboard/home',
        component: HomePage,
        icon: Home,
      },
      {
        id: 'foods',
        name: 'Foods',
        title: '',
        path: '/dashboard/foods/:categoryId',
        component: FoodsPage,
        isHidden: true,
        icon: Home,
      },
      {
        id: 'food',
        name: 'Food',
        title: '',
        path: '/dashboard/food/:foodId',
        component: FoodPage,
        isHidden: true,
        icon: Home,
      },
    ],
  },
  {
    id: 'bag',
    name: 'Bag Menu',
    isHidden: false,
    routes: [
      {
        id: 'bag',
        name: 'Your Bag',
        path: '/dashboard/bag',
        component: Bag,
        icon: Cart,
      },
    ],
  },
  {
    id: 'order',
    name: 'Order Menu',
    isHidden: false,
    routes: [
      {
        id: ' ',
        name: 'Order',
        path: '/dashboard/order',
        component: Order,
        icon: TextBoxCheck,
      },
    ],
  },
  {
    id: 'profile',
    name: 'Profile Menu',
    isHidden: false,
    routes: [
      {
        id: 'profile',
        name: 'Profile',
        path: '/dashboard/profile',
        component: Profile,
        icon: Account,
      },
    ],
  },
  {
    id: 'auth',
    name: 'Auth',
    isHidden: false,
    routes: [
      {
        id: 'signin',
        name: 'Sign in',
        path: '/signin',
        icon: Login,
      },
      {
        id: 'signout',
        name: 'Sign out',
        path: '/sign',
        icon: Logout,
      }
    ],
  },
  {
    id: 'aboutus',
    name: 'About Us Menu',
    isHidden: false,
    routes: [
      {
        id: 'aboutUs',
        name: 'About Us',
        path: '/dashboard/aboutUs',
        component: AboutUs,
        icon: Contacts,
      },
    ],
  },
];

export default routeCategories;
