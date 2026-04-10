import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ADMIN_EMAILS = ['wealthwizard1k@gmail.com', 'abdulhadimonu@gmail.com'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const initializationRef = useRef(false);

  const createOrUpdateProfile = async (firebaseUser: User) => {
    const docRef = doc(db, 'users', firebaseUser.uid);
    const docSnap = await getDoc(docRef);
    
    const isAdminEmail = firebaseUser.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(firebaseUser.email.toLowerCase());
    
    if (docSnap.exists()) {
      const existingProfile = docSnap.data() as UserProfile;
      if (isAdminEmail && existingProfile.role !== 'admin') {
        await setDoc(docRef, { ...existingProfile, role: 'admin' }, { merge: true });
        setProfile({ ...existingProfile, role: 'admin' });
      } else {
        setProfile(existingProfile);
      }
    } else {
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'User',
        role: isAdminEmail ? 'admin' : 'user',
        addresses: [],
        createdAt: Date.now(),
        totalSpent: 0,
        orderCount: 0
      };
      await setDoc(docRef, newProfile);
      setProfile(newProfile);
    }
  };

  useEffect(() => {
    if (initializationRef.current) return;
    initializationRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          await createOrUpdateProfile(firebaseUser);
        } catch (error) {
          console.error('Error creating/updating profile:', error);
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || 'User',
            role: firebaseUser.email && ADMIN_EMAILS.map(e => e.toLowerCase()).includes(firebaseUser.email.toLowerCase()) ? 'admin' : 'user',
            addresses: [],
            createdAt: Date.now(),
            totalSpent: 0,
            orderCount: 0
          });
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    if (user) {
      try {
        await createOrUpdateProfile(user);
      } catch (error) {
        console.error('Error refreshing profile:', error);
      }
    }
  };

  const logout = () => signOut(auth);

  const isAdmin = profile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
