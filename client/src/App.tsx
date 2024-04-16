import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { SideBarNav } from './components/Sidebar/SideBarNav';
import { Header } from './components/Header/Header';
import { TasksContainer } from './components/Tasks/TasksContainer';

const App = () => {
    return (
        <Router>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <SideBarNav />
                <div className="flex flex-col">
                    <Header />
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <Routes>
                            <Route path="/" element={<>home</>} />
                            <Route path="/tasks" element={<TasksContainer />} />
                            <Route path="/dashboard" element={<>dashboard</>} />
                            <Route path="/analytics" element={<>analytics</>} />
                            <Route element={<> Not found</>} />
                        </Routes>
                    </main>
                </div>
            </div>
        </Router>
    );
};

export default App;
