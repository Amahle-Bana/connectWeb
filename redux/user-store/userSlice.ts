import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type DeliveryChannel =
  | 'app'
  | 'email'
  | 'number'
  | 'app&email'
  | 'all';

export type MessagingRequestsFrom =
  | 'Everyone'
  | 'Paid Subscribers'
  | 'Free Subscribers'
  | 'No One';

// User Slice Types - matching backend User model exactly
interface UserState {
  // Core user fields (matching Django User model)
  id: number | null;
  username: string;
  email: string;
  fullName: string | null;
  password?: string; // Optional since it's not typically exposed to frontend
  
  // Profile fields
  profilePicture: string | null;
  bio: string | null;
  privacySettings: string | null; // Public/Private choices
  structure: string | null; // Campus Structure

  // Social media fields
  userFacebook: string | null;
  userInstagram: string | null;
  userXTwitter: string | null;
  userThreads: string | null;
  userYouTube: string | null;
  userLinkedIn: string | null;
  userTikTok: string | null;
  
  // System fields (matching Django model timestamps)
  createdAt: string | null;
  updatedAt: string | null;

  // Notification & settings (persisted via settings UI + updateUserField)
  articleDelivery: DeliveryChannel;
  magazineDelivery: DeliveryChannel;
  podcastDelivery: DeliveryChannel;
  engagementLikesApp: boolean;
  engagementLikesEmail: boolean;
  engagementCommentsApp: boolean;
  engagementCommentsEmail: boolean;
  engagementSharesApp: boolean;
  engagementSharesEmail: boolean;
  engagementMentionsApp: boolean;
  engagementMentionsEmail: boolean;
  connectionsFollowersApp: boolean;
  connectionsFollowersEmail: boolean;
  connectionsSubscribersApp: boolean;
  connectionsSubscribersEmail: boolean;
  connectionsChatsApp: boolean;
  connectionsChatsEmail: boolean;
  connectionsChartsUpdatesApp: boolean;
  connectionsChartsUpdatesEmail: boolean;
  messagingChatRepliesApp: boolean;
  messagingChatRepliesEmail: boolean;
  messagingRequestsFrom: MessagingRequestsFrom;
  filterExplicitContent: boolean;
  autoPlayVideos: boolean;
  blockedAccounts: boolean;
  mutedAccounts: boolean;
  hiddenPublications: boolean;
  manageInterests: boolean;
  showLikesOnProfile: boolean;
  allowMentions: boolean;
  allowGuestPosts: boolean;
  contactMatching: boolean;
}

// User Slice Initial Values
const initialState: UserState = {
  // Core user fields
  id: null,
  username: '',
  email: '',
  fullName: null,
  
  // Profile fields
  profilePicture: null,
  bio: null,
  privacySettings: null,
  structure: null,

  // Social media fields
  userFacebook: null,
  userInstagram: null,
  userXTwitter: null,
  userThreads: null,
  userYouTube: null,
  userLinkedIn: null,
  userTikTok: null,
  
  // System fields
  createdAt: null,
  updatedAt: null,

  articleDelivery: 'all',
  magazineDelivery: 'all',
  podcastDelivery: 'all',
  engagementLikesApp: true,
  engagementLikesEmail: true,
  engagementCommentsApp: true,
  engagementCommentsEmail: true,
  engagementSharesApp: true,
  engagementSharesEmail: true,
  engagementMentionsApp: true,
  engagementMentionsEmail: true,
  connectionsFollowersApp: true,
  connectionsFollowersEmail: true,
  connectionsSubscribersApp: true,
  connectionsSubscribersEmail: true,
  connectionsChatsApp: true,
  connectionsChatsEmail: true,
  connectionsChartsUpdatesApp: true,
  connectionsChartsUpdatesEmail: true,
  messagingChatRepliesApp: true,
  messagingChatRepliesEmail: true,
  messagingRequestsFrom: 'Everyone',
  filterExplicitContent: true,
  autoPlayVideos: true,
  blockedAccounts: true,
  mutedAccounts: true,
  hiddenPublications: true,
  manageInterests: true,
  showLikesOnProfile: true,
  allowMentions: true,
  allowGuestPosts: true,
  contactMatching: true,
};

// User Slice Functions
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Partial<UserState>>) => {
      return { ...state, ...action.payload };
    },
    clearUser: (state) => {
      return initialState;
    },
    updateUserField: <K extends keyof UserState>(
      state: UserState,
      action: PayloadAction<{ field: K; value: UserState[K] }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    updateUserStructure: (state, action: PayloadAction<string | null>) => {
      state.structure = action.payload;
    },
  },
});

// Exporting Functions
export const { setUser, clearUser, updateUserField, updateUserStructure } = userSlice.actions;
export default userSlice.reducer; 