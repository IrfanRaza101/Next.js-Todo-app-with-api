import { NextResponse } from 'next/server';

type Todo = {
    id: string;
    text: string;
    completed: boolean;
};

// In-memory todos array
let todos: Todo[] = [];

export async function GET() {
    return NextResponse.json(todos);
}

export async function POST(request: Request) {
    const body = await request.json();
    const newTodo: Todo = {
        id: Math.random().toString(36).substring(7),
        text: body.text,
        completed: false,
    };
    todos.push(newTodo);
    return NextResponse.json(newTodo);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const index = todos.findIndex((todo) => todo.id === body.id);
    if (index !== -1) {
        todos[index] = { ...todos[index], ...body };
        return NextResponse.json(todos[index]);
    }
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const index = todos.findIndex((todo) => todo.id === id);
    if (index !== -1) {
        todos = todos.filter((todo) => todo.id !== id);
        return NextResponse.json({ message: 'Todo deleted' });
    }
    return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
}
