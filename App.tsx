import React, { useEffect } from 'react';
import { Provider as ReduxProvider, useDispatch } from 'react-redux';
import { store } from './src/redux/store';
import Navigation from './src/navigation/Navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme } from './src/theme/theme';
import { Appearance } from 'react-native';
import Toast from 'react-native-toast-message';

// 🔹 Import All Context Providers
import { GlobalProvider } from './src/context/GlobalContext';
import { AdminUsersProvider } from './src/context/AdminUsersContext';
import { UserDetailsProvider } from './src/context/UserDetailsContext';
import { DetailsProvider } from './src/context/DeatailsContext'; // ✅ Wrap BEFORE dependent contexts
import { TemplatesProvider } from './src/context/TemplatesContext';
import { UserCardioProvider } from './src/context/UserContexts/CardioContext';
import { UserRecoveryProvider } from './src/context/UserContexts/RecoveryContext';
import { ReminderSupplementProvider } from './src/context/UserContexts/ReminderSupplementContext';
import { UserSupplementProvider } from './src/context/UserContexts/SupplementContext';
import { WeightTrackerProvider } from './src/context/UserContexts/WeightTrackerContext';
import { UserWorkoutProvider } from './src/context/UserContexts/WorkoutContext';

// 🔹 Load i18n configurations
import './src/i18n/i18n';

// 🔹 App Component
export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeInitializer />
      <GlobalProvider>
        <AdminUsersProvider>
          <UserDetailsProvider>
            <DetailsProvider> {/* ✅ Ensure parentIds exists before using dependent contexts */}
              <TemplatesProvider>
                <UserWorkoutProvider>
                  <UserCardioProvider>
                    <UserRecoveryProvider>
                      <UserSupplementProvider>
                        <ReminderSupplementProvider>
                          <WeightTrackerProvider>
                            <Navigation />
                            <Toast />
                          </WeightTrackerProvider>
                        </ReminderSupplementProvider>
                      </UserSupplementProvider>
                    </UserRecoveryProvider>
                  </UserCardioProvider>
                </UserWorkoutProvider>
              </TemplatesProvider>
            </DetailsProvider>
          </UserDetailsProvider>
        </AdminUsersProvider>
      </GlobalProvider>
    </ReduxProvider>
  );
}

// 🔹 Theme Initializer
const ThemeInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        dispatch(setTheme(JSON.parse(savedTheme)));
      } else {
        dispatch(setTheme(Appearance.getColorScheme() === 'dark'));
      }
    };
    loadTheme();
  }, [dispatch]);

  return null;
};
