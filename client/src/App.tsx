import { Login, ResetPassword, SignUp, TasksContainer } from '@/components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context';
import { Container } from '@/components';

const queryClient = new QueryClient();

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
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
                                            <Route path="/tasks" element={<TasksContainer />} />
                                            <Route path="/dashboard" element={<>dashboard</>} />
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
