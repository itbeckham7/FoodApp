import { Account, AccountMultiple, Home, Cart, TextBoxCheck, Contacts, Login, Logout, Newspaper } from 'mdi-material-ui';
import UserList from './containers/Users/UserList';
import Profile from './containers/Auth/Profile';
import HomePage from './containers/Home/Home';
import FoodsPage from './containers/Home/Foods';
import FoodPage from './containers/Home/Food';
import Order from './containers/Order/Order';
import BagPage from './containers/Bag/Bag';
import CheckOutBagPage from './containers/Bag/CheckOutBag';
import CheckOutInfoPage from './containers/CheckOut/CheckOutInfo';
import CheckOutResultPage from './containers/CheckOut/CheckOutResult';
import AboutUs from './containers/Common/AboutUs';
import ContactUs from './containers/Common/ContactUs';

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
        icon: '/images/home.png'
      },
      {
        id: 'foods',
        name: 'Foods',
        title: '',
        path: '/dashboard/foods/:categoryId',
        component: FoodsPage,
        isHidden: true,
        icon: '/images/home.png',
      },
      {
        id: 'food',
        name: 'Food',
        title: '',
        path: '/dashboard/food/:foodId',
        component: FoodPage,
        isHidden: true,
        icon: '/images/home.png',
      },
      {
        id: 'bag',
        name: 'Bag',
        title: '',
        path: '/dashboard/bag',
        component: BagPage,
        isHidden: true,
        icon: '/images/home.png',
      },
      {
        id: 'bag',
        name: 'Bag',
        title: '',
        path: '/common/search',
        component: BagPage,
        isHidden: true,
        icon: '/images/home.png',
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
        component: BagPage,
        icon: '/images/BASKET.png',
      },
      {
        id: 'bag',
        name: 'Your Bag',
        path: '/bag/checkout',
        component: CheckOutBagPage,
        isHidden: true,
        icon: '/images/BASKET.png',
      },
      {
        id: 'checkoutinfo',
        name: 'Check Out Info',
        path: '/checkout/checkoutinfo',
        component: CheckOutInfoPage,
        isHidden: true,
        icon: '/images/BASKET.png',
      },
      {
        id: 'checkoutresult',
        name: 'Check Out Result',
        path: '/checkout/checkoutresult',
        component: CheckOutResultPage,
        isHidden: true,
        icon: '/images/BASKET.png',
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
        name: 'Order Status',
        path: '/dashboard/order',
        component: Order,
        icon: '/images/BASKET.png',
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
        icon: '/images/Profile.png',
      },
    ],
  },
  {
    id: 'contactus',
    name: 'Contact Us Menu',
    isHidden: false,
    routes: [
      {
        id: 'contactUs',
        name: 'Contact Us',
        path: '/common/contactUs',
        component: ContactUs,
        icon: '/images/old-typical-phone.png',
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
        icon: '/images/Profile.png',
      },
      {
        id: 'signout',
        name: 'Sign out',
        path: '/sign',
        icon: '/images/Profile.png',
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
        path: '/common/aboutUs',
        component: AboutUs,
        icon: '/images/Profile1.png',
      },
    ],
  },
];

export default routeCategories;
