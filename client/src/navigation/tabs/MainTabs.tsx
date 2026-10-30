
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from '@react-native-vector-icons/ionicons';
import type {MainTabParamList} from '../types';
import PlaceholderScreen from '../../views/screens/PlaceholderScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeScreen = () => <PlaceholderScreen title="Home" />;
const ComplaintsScreen = () => <PlaceholderScreen title="Complaints" />;
const FacilitiesScreen = () => <PlaceholderScreen title="Facilities" />;
const ProfileScreen = () => <PlaceholderScreen title="Profile" />;

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#244C3A',
        tabBarInactiveTintColor: '#929BA8',
        tabBarStyle: {
          height: 66,
          paddingTop: 8,
          paddingBottom: 8,
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E8ECE8',
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ComplaintsTab"
        component={ComplaintsScreen}
        options={{
          tabBarLabel: 'Complaints',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="clipboard-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="FacilitiesTab"
        component={FacilitiesScreen}
        options={{
          tabBarLabel: 'Facilities',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="business-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabs;
