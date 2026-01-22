import { ReactNode } from 'react';

interface IHabitsContainerProps {
    children: ReactNode;
}

export const HabitsContainer: React.FC<IHabitsContainerProps> = ({ children }) => {
    return (
        <div className="habits-container">
            {children}
        </div>
    );
};