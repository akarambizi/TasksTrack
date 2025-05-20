export interface IToDoTask {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    createdDate: string;
    updatedDate?: string;
    createBy: string;
    updatedBy?: string;
    priority: 'low' | 'medium' | 'high';
}
