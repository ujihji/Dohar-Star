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
  user: User | null;
  profile: Creator | null;
  loading: boolean;
  signup: (email: string, pass: string, name: string, handle: string) => Promise<void>;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<Creator>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
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
            await setDoc(userDocRef, newProfile);
            setProfile(newProfile);
          }
        } catch (err) {
          console.error('Error loading user profile from Firestore:', err);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email: string, pass: string, name: string, handle: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(res.user, { displayName: name });

    const newProfile: Creator = {
      id: res.user.uid,
      handle: handle.startsWith('@') ? handle.slice(1) : handle,
      name,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
      isVerified: false,
      isFollowing: false,
      bio: '✨ Dohar Star Creator | Welcome to my page!',
      followers: 1,
      following: 0,
      totalLikes: 0,
    };

    await setDoc(doc(db, 'users', res.user.uid), newProfile);
    setProfile(newProfile);
  };

  const login = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const updateUserProfile = async (data: Partial<Creator>) => {
    if (!user) return;
    const updated = { ...profile, ...data } as Creator;
    setProfile(updated);
    await setDoc(doc(db, 'users', user.uid), updated, { merge: true });
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
