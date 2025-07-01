import React from 'react';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';

interface TodoItemProps {
  todo: {
    id: string;
    text: string;
    completed: boolean;
  };
  onDelete: (id: string) => void;
  onToggle: (id: string, completed: boolean) => void;
  onEdit: (id: string, text: string) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  onToggle,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editText, setEditText] = React.useState(todo.text);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(todo.id, editText);
    setIsEditing(false);
  };

  return (
    <div className={
      `flex items-center gap-2 p-3 rounded-2xl shadow-md bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:scale-[1.025] hover:shadow-xl group ${todo.completed ? 'opacity-60' : ''}`
    }>
      <Checkbox
        checked={todo.completed}
        onCheckedChange={(checked) => onToggle(todo.id, checked as boolean)}
        className="mr-2 scale-110 accent-[#a21caf]"
      />
      {isEditing ? (
        <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="flex-1 px-3 py-1.5 border rounded-lg bg-white/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-white shadow focus:ring-2 focus:ring-[#a21caf] outline-none"
            autoFocus
          />
          <Button type="submit" size="sm" className="bg-gradient-to-r from-[#2563eb] to-[#a21caf] text-white font-bold">Save</Button>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm"
            onClick={() => setIsEditing(false)}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
          >
            Cancel
          </Button>
        </form>
      ) : (
        <>
          <span className={`flex-1 text-base font-medium truncate ${todo.completed ? 'line-through text-zinc-400 dark:text-zinc-500' : 'text-zinc-800 dark:text-zinc-100'}`}>{todo.text}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="text-[#2563eb] hover:bg-[#2563eb22]"
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(todo.id)}
            className="hover:scale-110 transition-transform"
          >
            Delete
          </Button>
        </>
      )}
    </div>
  );
};
