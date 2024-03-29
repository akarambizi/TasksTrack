import { HabitsCard } from './HabitsCard';

export const HabitsCardList = () => {
    return (
        <div className="flex gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <HabitsCard key={index}/>
            ))}
        </div>
    );
};
