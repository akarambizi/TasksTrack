import { Container, Dashboard, Login, ResetPassword, SignUp, HabitDetailPage, SyncCenter, WeeklyReview, PerformanceHub, ProductivityHub } from '@/components';
import { QueryClientProvider } from '@/components/providers';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
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
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/" element={<Dashboard />} />
                                            <Route path="/dashboard" element={<Dashboard />} />
                                            <Route path="/productivity" element={<ProductivityHub />} />
                                            <Route path="/habits" element={<Navigate to="/productivity?tab=habits" replace />} />
                                            <Route path="/habits/:habitId" element={<HabitDetailPage />} />
                                            <Route path="/focus-sessions" element={<Navigate to="/productivity?tab=focus" replace />} />
                                            <Route path="/goals" element={<Navigate to="/productivity?tab=goals" replace />} />
                                            <Route path="/analytics" element={<PerformanceHub />} />
                                            <Route path="/history" element={<Navigate to="/analytics?tab=sessions" replace />} />
                                            <Route path="/statistics" element={<Navigate to="/analytics?tab=statistics" replace />} />
                                            <Route path="/retrospective" element={<Navigate to="/analytics?tab=retrospective" replace />} />
                                            <Route path="/weekly-review" element={<WeeklyReview />} />
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
