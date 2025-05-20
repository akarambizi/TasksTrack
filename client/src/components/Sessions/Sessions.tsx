
export const Sessions = () => {
    const sessionHistory = [
        { id: 1, task: 'Complete UI Design', duration: 25, date: 'May 15, 2025' },
        { id: 2, task: 'Create Pomodoro Timer', duration: 25, date: 'May 14, 2025' },
        { id: 3, task: 'Implement Authentication', duration: 50, date: 'May 14, 2025' }
    ];
    return (
        <div className="flex-1 overflow-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Session History</h3>
                    <p className="text-sm text-slate-500">Review your completed Pomodoro sessions</p>
                </div>
            </div>

            <div className="bg-white rounded-lg border border-slate-200">
                <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 font-medium text-slate-600 text-sm">
                    <div className="col-span-1">#</div>
                    <div className="col-span-6">Task</div>
                    <div className="col-span-2">Duration</div>
                    <div className="col-span-3">Date</div>
                </div>

                {sessionHistory.map((session) => (
                    <div key={session.id} className="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 text-sm hover:bg-slate-50">
                        <div className="col-span-1 text-slate-500">{session.id}</div>
                        <div className="col-span-6 font-medium text-slate-800">{session.task}</div>
                        <div className="col-span-2">{session.duration} mins</div>
                        <div className="col-span-3 text-slate-500">{session.date}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};
