import { Dashboard } from './components/DashBoard/DashBoard';
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
    return (
        <Router>
            <Dashboard />
        </Router>
    );
};

export default App;
