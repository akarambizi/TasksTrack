import { Container, Dashboard, Login, Pomodoro, ResetPassword, Sessions, SignUp, HabitsContainer } from '@/components';
import { QueryClientProvider } from '@/components/providers';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context';
import { ToastContainer } from '@/components/ui/toast-container';

const App = () => {
    return (
        <QueryClientProvider>
            <AuthProvider>
                <Router>
                    <ToastContainer />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<SignUp />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route
                            path="*"
                            element={
                                <ProtectedRoute>
                                    <Container>
                                        <Routes>
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/habits" element={<HabitsContainer />} />
                                            <Route path="/pomodoro" element={<Pomodoro />} />
                                            <Route path="/history" element={<Sessions />} />
                                            <Route path="/analytics" element={<>analytics</>} />
                                            <Route path="*" element={<div>Not found</div>} />
                                        </Routes>
                                    </Container>
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
