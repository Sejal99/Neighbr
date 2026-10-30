export type LoginRouteParams =
  | {
      registrationSuccess?: string;
      registeredEmail?: string;
    }
  | undefined;

export type AuthStackParamList = {
  Login: LoginRouteParams;
  Register: undefined;
  ForgotPassword: undefined;
};

export type HomeStackParamList = {
  Home: undefined;
};

export type ComplaintsStackParamList = {
  Complaints: undefined;
  ComplaintDetails: {complaintId: string};
};

export type FacilitiesStackParamList = {
  Facilities: undefined;
  FacilityDetails: {facilityId: string};
  BookingDetails: {bookingId: string};
};

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
};

export type MainTabParamList = {
  HomeTab: undefined;
  ComplaintsTab: undefined;
  FacilitiesTab: undefined;
  ProfileTab: undefined;
};