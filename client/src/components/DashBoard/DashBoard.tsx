import { ToastTestButton } from '../ui/toast-test-button';

export const Dashboard = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="bg-card p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Welcome to TasksTrack</h2>
                <p className="mb-4">This is your dashboard where you can access all the features of the application.</p>

                <div className="mt-8">
                    <h3 className="text-lg font-medium mb-3">Toast Notification Test</h3>
                    <p className="mb-4">Click the button below to test toast notifications:</p>
                    <ToastTestButton />
                </div>
            </div>
        </div>
    );
};
