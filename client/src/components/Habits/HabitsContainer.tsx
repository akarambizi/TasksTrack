import { Habits } from './Habits';

export const HabitsContainer = () => {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">Habits</h1>
            </div>
            <Habits />
        </>
    );
};