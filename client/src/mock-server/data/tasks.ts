import { IToDoTask } from "@/api";

const tasks: IToDoTask[] = [
    {
        "id": 1,
        "title": "Task 1",
        "description": "This is the first task",
        "completed": false,
        "createdDate": "2022-01-01",
        "createBy": "User1"
    },
    {
        "id": 2,
        "title": "Task 2",
        "description": "This is the second task",
        "completed": true,
        "createdDate": "2022-01-02",
        "updatedDate": "2022-01-03",
        "createBy": "User2",
        "updatedBy": "User1"
    }
];

export default tasks;