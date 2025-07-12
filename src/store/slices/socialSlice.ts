import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SocialContent, Comment } from '../../types';

interface SocialState {
  feed: SocialContent[];
  stories: SocialContent[];
  reels: SocialContent[];
  userPosts: { [userId: string]: SocialContent[] };
  loading: boolean;
  error: string | null;
  activeStoryIndex: number;
  activeReelIndex: number;
}

const initialState: SocialState = {
  feed: [],
  stories: [],
  reels: [],
  userPosts: {},
  loading: false,
  error: null,
  activeStoryIndex: 0,
  activeReelIndex: 0,
};

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<SocialContent[]>) => {
      state.feed = action.payload;
      state.error = null;
    },
    addToFeed: (state, action: PayloadAction<SocialContent>) => {
      state.feed.unshift(action.payload);
    },
    setStories: (state, action: PayloadAction<SocialContent[]>) => {
      state.stories = action.payload;
    },
    addStory: (state, action: PayloadAction<SocialContent>) => {
      state.stories.unshift(action.payload);
    },
    removeExpiredStories: (state) => {
      const now = new Date();
      state.stories = state.stories.filter(story => 
        story.expiresAt && new Date(story.expiresAt) > now
      );
    },
    setReels: (state, action: PayloadAction<SocialContent[]>) => {
      state.reels = action.payload;
    },
    addReel: (state, action: PayloadAction<SocialContent>) => {
      state.reels.unshift(action.payload);
    },
    setUserPosts: (state, action: PayloadAction<{ userId: string; posts: SocialContent[] }>) => {
      const { userId, posts } = action.payload;
      state.userPosts[userId] = posts;
    },
    addUserPost: (state, action: PayloadAction<{ userId: string; post: SocialContent }>) => {
      const { userId, post } = action.payload;
      if (!state.userPosts[userId]) {
        state.userPosts[userId] = [];
      }
      state.userPosts[userId].unshift(post);
    },
    toggleLike: (state, action: PayloadAction<{ contentId: string; increment: boolean }>) => {
      const { contentId, increment } = action.payload;
      const updateLikes = (content: SocialContent) => {
        if (content.id === contentId) {
          content.likes += increment ? 1 : -1;
        }
      };
      
      state.feed.forEach(updateLikes);
      state.stories.forEach(updateLikes);
      state.reels.forEach(updateLikes);
      Object.values(state.userPosts).forEach(posts => 
        posts.forEach(updateLikes)
      );
    },
    addComment: (state, action: PayloadAction<{ contentId: string; comment: Comment }>) => {
      const { contentId, comment } = action.payload;
      const addCommentToContent = (content: SocialContent) => {
        if (content.id === contentId) {
          content.comments.push(comment);
        }
      };
      
      state.feed.forEach(addCommentToContent);
      state.reels.forEach(addCommentToContent);
      Object.values(state.userPosts).forEach(posts => 
        posts.forEach(addCommentToContent)
      );
    },
    setActiveStoryIndex: (state, action: PayloadAction<number>) => {
      state.activeStoryIndex = action.payload;
    },
    setActiveReelIndex: (state, action: PayloadAction<number>) => {
      state.activeReelIndex = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearSocialData: (state) => {
      state.feed = [];
      state.stories = [];
      state.reels = [];
      state.userPosts = {};
      state.error = null;
      state.activeStoryIndex = 0;
      state.activeReelIndex = 0;
    },
  },
});

export const {
  setFeed,
  addToFeed,
  setStories,
  addStory,
  removeExpiredStories,
  setReels,
  addReel,
  setUserPosts,
  addUserPost,
  toggleLike,
  addComment,
  setActiveStoryIndex,
  setActiveReelIndex,
  setLoading,
  setError,
  clearSocialData,
} = socialSlice.actions;

export default socialSlice.reducer;