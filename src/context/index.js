import { UserDetailsProvider } from "./UserDetailsContext";
import { AdminUsersProvider } from "./AdminUsersContext";
import { UserJournalsProvider } from "./UserJournalsContext";
import { DetailsProvider } from "./DeatailsContext";
import { TemplatesProvider } from "./TemplatesContext";
import {
  UserWorkoutProvider,
  UserTemplatesProvider,
  UserCardioProvider,
  UserRecoveryProvider,
  UserSupplementProvider,
  ReminderSupplementProvider,
  WeightTrackerProvider,
} from "./UserContexts";
import { GlobalProvider } from "./GlobalContext";

const Providers = ({ children }) => {
  return (
    <GlobalProvider>
      <AdminUsersProvider>
        <UserDetailsProvider>
          <DetailsProvider>
            <TemplatesProvider>
              <UserWorkoutProvider>
                <UserTemplatesProvider>
                  <UserJournalsProvider>
                    <UserCardioProvider>
                      <UserRecoveryProvider>
                        <UserSupplementProvider>
                          <ReminderSupplementProvider>
                            <WeightTrackerProvider>
                              {children}
                            </WeightTrackerProvider>
                          </ReminderSupplementProvider>
                        </UserSupplementProvider>
                      </UserRecoveryProvider>
                    </UserCardioProvider>
                  </UserJournalsProvider>
                </UserTemplatesProvider>
              </UserWorkoutProvider>
            </TemplatesProvider>
          </DetailsProvider>
        </UserDetailsProvider>
      </AdminUsersProvider>
    </GlobalProvider>
  );
};

export default Providers;
