import { Request, Response, NextFunction } from 'express';
import categories from './categories.ts';

const parseIntId = (value: string): number | null => {
    const id = Number.parseInt(value, 10);
    return Number.isNaN(id) ? null : id;
};

const sendNotFound = (res: Response): void => {
    res.status(404).json({ message: 'Resource not found' });
};

export default function categoriesMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (!req.path.startsWith('/categories')) {
        next();
        return;
    }

    if (req.method === 'GET' && req.path === '/categories/active') {
        res.json(categories.filter((c) => c.isActive));
        return;
    }

    if (req.method === 'GET' && req.path === '/categories/parents') {
        const parentCategories = categories
            .filter((c) => !c.parentId)
            .map((parent) => ({
                ...parent,
                subCategories: categories.filter((child) => child.parentId === parent.id)
            }));
        res.json(parentCategories);
        return;
    }

    const categoryIdMatch = req.path.match(/^\/categories\/(\d+)$/);
    const categoryArchiveMatch = req.path.match(/^\/categories\/(\d+)\/archive$/);

    if (categoryIdMatch) {
        const categoryId = parseIntId(categoryIdMatch[1]);
        const categoryIndex = categories.findIndex((c) => c.id === categoryId);
        if (categoryIndex < 0) {
            sendNotFound(res);
            return;
        }

        if (req.method === 'PUT') {
            categories[categoryIndex] = {
                ...categories[categoryIndex],
                ...req.body,
                id: categoryId,
                updatedDate: new Date().toISOString(),
                updatedBy: 'test@example.com'
            };
            res.json(categories[categoryIndex]);
            return;
        }

        if (req.method === 'DELETE') {
            categories.splice(categoryIndex, 1);
            res.status(200).json({ message: 'Category deleted successfully' });
            return;
        }
    }

    if (categoryArchiveMatch && req.method === 'PATCH') {
        const categoryId = parseIntId(categoryArchiveMatch[1]);
        const category = categories.find((c) => c.id === categoryId);
        if (!category) {
            sendNotFound(res);
            return;
        }
        category.isActive = false;
        category.updatedDate = new Date().toISOString();
        category.updatedBy = 'test@example.com';
        res.json({ message: 'Category archived successfully' });
        return;
    }

    if (req.method === 'POST' && req.path === '/categories') {
        const now = new Date().toISOString();
        const newCategory = {
            id: categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
            name: req.body.name,
            description: req.body.description ?? '',
            color: req.body.color ?? '#2563EB',
            icon: req.body.icon ?? 'Folder',
            parentId: req.body.parentId,
            isActive: true,
            createdDate: now,
            updatedDate: now,
            createdBy: 'test@example.com',
            updatedBy: 'test@example.com'
        };
        categories.push(newCategory);
        res.status(201).json(newCategory);
        return;
    }

    next();
}
