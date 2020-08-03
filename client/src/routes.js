import { AccountMultiple } from 'mdi-material-ui';
import UserList from './containers/Users/UserList';
import Profile from './containers/Profile/Profile';
import ProfileGeneral from './containers/Profile/General';
import ProfileAddress  from './containers/Profile/Address';
import ProfileCard  from './containers/Profile/Card';
import OrderHistory  from './containers/Profile/OrderHistory';
import OrderDetail  from './containers/Profile/OrderDetail';
import OrderTrack  from './containers/Profile/OrderTrack';
import HomePage from './containers/Home/Home';
import FoodsPage from './containers/Home/Foods';
import FoodPage from './containers/Home/Food';
import SearchPage from './containers/Home/Search';
import Order from './containers/Order/Order';
import BagPage from './containers/Bag/Bag';
import CheckOutInfoPage from './containers/CheckOut/CheckOutInfo';
import CheckOutResultPage from './containers/CheckOut/CheckOutResult';
import AboutUs from './containers/Common/AboutUs';
import ContactUs from './containers/Common/ContactUs';
import Policy from './containers/Common/Policy';

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
        title: 'Home',
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
        id: 'search',
        name: 'Search',
        title: '',
        path: '/common/search',
        component: SearchPage,
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
        path: '/bag/checkout',
        component: BagPage,
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
        path: '/checkout/result/:result',
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
        name: 'Order History',
        path: '/profile/orderhistory',
        component: OrderHistory,
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
        title: 'Profile',
        path: '/profile/profile',
        component: Profile,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileGeneral',
        name: 'Profile General',
        title: '',
        isHidden: true,
        path: '/profile/general',
        component: ProfileGeneral,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileAddress',
        name: 'Profile Address',
        title: 'Shipping Address',
        isHidden: true,
        path: '/profile/address',
        component: ProfileAddress,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileCard',
        name: 'Profile Card',
        title: 'Cards',
        isHidden: true,
        path: '/profile/card',
        component: ProfileCard,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileOrder',
        name: 'Profile Order',
        title: 'Order History',
        isHidden: true,
        path: '/profile/orderhistory',
        component: OrderHistory,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileOrderDetail',
        name: 'Profile Order Detail',
        title: 'Order Detail',
        isHidden: true,
        path: '/profile/orderdetail/:orderId',
        component: OrderDetail,
        icon: '/images/Profile.png',
      },
      {
        id: 'profileOrderTrack',
        name: 'Profile Order Track',
        title: 'Order Track',
        isHidden: true,
        path: '/profile/ordertrack/:orderId',
        component: OrderTrack,
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
  {
    id: 'policy',
    name: 'Policy Menu',
    isHidden: false,
    routes: [
      {
        id: 'policy',
        name: 'Policy',
        path: '/common/policy',
        component: Policy,
        icon: '/images/edit-white.png',
      },
    ],
  },
];

export default routeCategories;
