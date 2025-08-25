import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User as UserProfile } from '@/types'; // Firestore user profile type

interface AuthContextType {
  currentUser: FirebaseAuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userProfile: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseAuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // User is signed in, fetch their profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data() as UserProfile);
        } else {
          // This case might happen if a user exists in Auth but not in Firestore
          // For example, if Firestore document creation failed during registration
          console.warn("User document not found in Firestore for UID:", user.uid);
          setUserProfile(null);
        }
      } else {
        // User is signed out
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
