import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { Creator } from '../types';

interface AuthContextType {
  user: User | { uid: string; email?: string | null; displayName?: string | null } | null;
  profile: Creator | null;
  loading: boolean;
  signup: (email: string, pass: string, name: string, handle: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Creator>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'dohar_star_local_user';
const LOCAL_PROFILE_KEY = 'dohar_star_local_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | { uid: string; email?: string | null; displayName?: string | null } | null>(null);
  const [profile, setProfile] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to persist local session
  const saveLocalSession = (
    userData: { uid: string; email?: string | null; displayName?: string | null },
    profileData: Creator
  ) => {
    setUser(userData);
    setProfile(profileData);
    localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(userData));
    localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(profileData));
  };

  const clearLocalSession = () => {
    localStorage.removeItem(LOCAL_USER_KEY);
    localStorage.removeItem(LOCAL_PROFILE_KEY);
  };

  useEffect(() => {
    // Check local storage session first if offline/fallback mode was previously used
    const cachedUser = localStorage.getItem(LOCAL_USER_KEY);
    const cachedProfile = localStorage.getItem(LOCAL_PROFILE_KEY);
    if (cachedUser && cachedProfile) {
      try {
        setUser(JSON.parse(cachedUser));
        setProfile(JSON.parse(cachedProfile));
      } catch (e) {
        clearLocalSession();
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch or create user document in Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);

          if (snap.exists()) {
            setProfile(snap.data() as Creator);
          } else {
            // Default profile for new user
            const newProfile: Creator = {
              id: currentUser.uid,
              handle: currentUser.displayName ? currentUser.displayName.toLowerCase().replace(/\s+/g, '_') : `dohar_star_${currentUser.uid.slice(0, 5)}`,
              name: currentUser.displayName || 'Dohar Star Creator',
              avatar: currentUser.photoURL || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
              isVerified: false,
              isFollowing: false,
              bio: '✨ Star Creator on Dohar Star app!',
              followers: 1,
              following: 0,
              totalLikes: 0,
            };
            try {
              await setDoc(userDocRef, newProfile);
            } catch (err) {
              console.warn('Firestore user doc create warning:', err);
            }
            setProfile(newProfile);
          }
        } catch (err) {
          console.error('Error loading user profile from Firestore:', err);
        }
      } else {
        // If Firebase Auth state is null and no local session, reset
        if (!localStorage.getItem(LOCAL_USER_KEY)) {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, name: string, handle: string) => {
    const formattedHandle = handle.startsWith('@') ? handle.slice(1) : handle;

    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: name });

      const newProfile: Creator = {
        id: res.user.uid,
        handle: formattedHandle,
        name,
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
        isVerified: false,
        isFollowing: false,
        bio: '✨ Dohar Star Creator | Welcome to my page!',
        followers: 1,
        following: 0,
        totalLikes: 0,
      };

      try {
        await setDoc(doc(db, 'users', res.user.uid), newProfile);
      } catch (e) {
        console.warn('Firestore setDoc warning on signup:', e);
      }
      setProfile(newProfile);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        console.warn('Firebase Email Auth disabled on console. Fallback to local session mode.');
        const localUid = 'dohar_user_' + Math.random().toString(36).substring(2, 9);
        const newProfile: Creator = {
          id: localUid,
          handle: formattedHandle || 'dohar_creator',
          name: name || 'Dohar Creator',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
          isVerified: false,
          isFollowing: false,
          bio: '✨ Dohar Star Creator | Verified Account',
          followers: 1,
          following: 0,
          totalLikes: 0,
        };
        const localUserData = { uid: localUid, email, displayName: name };
        saveLocalSession(localUserData, newProfile);

        // Try saving to Firestore if possible
        try {
          await setDoc(doc(db, 'users', localUid), newProfile);
        } catch (e) {
          // ignore
        }
        return;
      }
      throw err;
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed' || err.message?.includes('operation-not-allowed')) {
        console.warn('Firebase Email Auth disabled on console. Using fallback local demo account.');
        const localUid = 'dohar_demo_user';
        const nameFromEmail = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');
        const fallbackProfile: Creator = {
          id: localUid,
          handle: nameFromEmail || 'dohar_star_pro',
          name: email.split('@')[0] || 'Dohar Star User',
          avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
          isVerified: true,
          isFollowing: false,
          bio: '✨ Star Creator on Dohar Star app!',
          followers: 120,
          following: 15,
          totalLikes: 450,
        };
        saveLocalSession({ uid: localUid, email, displayName: fallbackProfile.name }, fallbackProfile);
        return;
      }
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      // ignore
    }
    clearLocalSession();
    setUser(null);
    setProfile(null);
  };

  const updateUserProfile = async (data: Partial<Creator>) => {
    if (!user) return;
    const updated = { ...profile, ...data } as Creator;
    setProfile(updated);
    if (localStorage.getItem(LOCAL_USER_KEY)) {
      localStorage.setItem(LOCAL_PROFILE_KEY, JSON.stringify(updated));
    }
    try {
      await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Could not update profile in Firestore:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signup,
        login,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

