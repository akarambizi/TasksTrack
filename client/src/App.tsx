import { Container } from '@/components';
import { Login } from '@/features/Auth/Login';
import { ResetPassword } from '@/features/Auth/ResetPassword';
import { SignUp } from '@/features/Auth/SignUp';
import { HabitDetailPage } from '@/features/Habits/HabitDetailPage';
import { PerformanceHub } from '@/pages/AnalyticsPage';
import { Dashboard } from '@/pages/DashBoard';
import { ProductivityHub } from '@/pages/ProductivityHub';
import { SyncCenter } from '@/pages/SyncCenter';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, QueryClientProvider } from './context';
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
                                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/productivity" element={<ProductivityHub />} />
                                            <Route path="/habits/:habitId" element={<HabitDetailPage />} />
                                            <Route path="/analytics" element={<PerformanceHub />} />
                                            <Route path="/sync" element={<SyncCenter />} />
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
