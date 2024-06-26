import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const TasksTable = () => {
    return (
        <div className="rounded-lg border shadow-sm">
            <Table>
                <TableCaption>A list of your recent tasks.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Task</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell className="font-medium">Task-1</TableCell>
                        <TableCell>Testing Table</TableCell>
                        <TableCell>Complete</TableCell>
                        <TableCell>Medium</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
