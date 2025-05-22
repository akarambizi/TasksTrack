import { Container, Login, Pomodoro, ResetPassword, Sessions, SignUp, TasksContainer } from '@/components';
import { QueryClientProvider } from '@/components/providers';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context';

const App = () => {
    return (
        <QueryClientProvider>
            <AuthProvider>
                <Router>
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
                                            <Route path="/dashboard" element={<>dashboard</>} />
                                            <Route path="/tasks" element={<TasksContainer />} />
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
