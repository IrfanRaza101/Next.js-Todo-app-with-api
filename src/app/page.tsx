'use client';

import { useState, useEffect } from 'react';
import { TodoItem } from '@/components/TodoItem';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Sun, Moon, Trash2, UserCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
const FaCheckCircle = dynamic(() => import('react-icons/fa').then(mod => mod.FaCheckCircle), { ssr: false });
const FaHourglassHalf = dynamic(() => import('react-icons/fa').then(mod => mod.FaHourglassHalf), { ssr: false });
const FaListUl = dynamic(() => import('react-icons/fa').then(mod => mod.FaListUl), { ssr: false });

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [dark, setDark] = useState(false);

  // Fetch todos on component mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const data = await response.json();
    setTodos(data);
  };

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: newTodo }),
    });
    const data = await response.json();
    setTodos([...todos, data]);
    setNewTodo('');
  };

  const deleteTodo = async (id: string) => {
    await fetch(`/api/todos?id=${id}`, { method: 'DELETE' });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = async (id: string, completed: boolean) => {
    const response = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed }),
    });
    const updatedTodo = await response.json();
    setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
  };

  const editTodo = async (id: string, text: string) => {
    const response = await fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, text }),
    });
    const updatedTodo = await response.json();
    setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    setEditingId(null);
    setEditText('');
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div style={{ minHeight: '100vh', background: '#f6f8fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 480, background: '#fff', borderRadius: 20, boxShadow: '0 4px 32px #0001', padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16, color: '#2d3748', letterSpacing: '-1px' }}>My Todos</h1>
        {/* Progress & Stats */}
        <div style={{ width: '100%', marginBottom: 28, background: '#f7fafc', borderRadius: 12, padding: 18, boxShadow: '0 2px 8px #0001', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#4a5568', fontSize: 16 }}><FaListUl style={{ marginRight: 6, color: '#3182ce' }} /> Total: {todos.length}</span>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#38a169', fontSize: 16 }}><FaCheckCircle style={{ marginRight: 6 }} /> Completed: {completedCount}</span>
            <span style={{ display: 'flex', alignItems: 'center', fontWeight: 700, color: '#e53e3e', fontSize: 16 }}><FaHourglassHalf style={{ marginRight: 6 }} /> Pending: {pendingCount}</span>
          </div>
          <div style={{ width: '100%', height: 14, background: '#e2e8f0', borderRadius: 8, overflow: 'hidden', marginTop: 2 }}>
            <div style={{ width: `${todos.length === 0 ? 0 : (completedCount / todos.length) * 100}%`, height: '100%', background: 'linear-gradient(90deg,#38a169,#3182ce)', borderRadius: 8, transition: 'width 0.4s' }} />
          </div>
        </div>
        <form onSubmit={addTodo} style={{ display: 'flex', width: '100%', gap: 8, marginBottom: 18 }}>
          <input
            type="text"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: 15 }}
          />
          <button type="submit" style={{ padding: '0 18px', borderRadius: 8, background: '#3182ce', color: '#fff', fontWeight: 600, border: 'none', fontSize: 15, cursor: 'pointer' }}>Add</button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0, width: '100%', margin: 0 }}>
          {todos.length === 0 ? (
            <li style={{ textAlign: 'center', color: '#a0aec0', padding: '32px 0' }}>No todos yet!</li>
          ) : (
            todos.map(todo => (
              <li key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 0', borderBottom: '1px solid #f1f1f1', width: '100%' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id, !todo.completed)}
                  style={{ width: 18, height: 18 }}
                />
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{ flex: 1, minWidth: 0, maxWidth: '100%', padding: '8px 10px', borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 15, overflow: 'hidden', textOverflow: 'ellipsis' }}
                    />
                    <button onClick={() => editTodo(todo.id, editText)} style={{ background: '#38a169', color: '#fff', border: 'none', borderRadius: 6, padding: '4px 12px', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginLeft: 4, whiteSpace: 'nowrap' }}>Save</button>
                    <button onClick={() => { setEditingId(null); setEditText(''); }} style={{ background: '#e2e8f0', color: '#2d3748', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginLeft: 4, whiteSpace: 'nowrap' }}>Cancel</button>
                  </>
                ) : (
                  <>
                    <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none', color: todo.completed ? '#a0aec0' : '#2d3748', fontSize: 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{todo.text}</span>
                    <button onClick={() => { setEditingId(todo.id); setEditText(todo.text); }} style={{ background: '#f6e05e', color: '#744210', border: 'none', borderRadius: 6, padding: '4px 10px', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginLeft: 4, whiteSpace: 'nowrap' }}>Edit</button>
                    <button onClick={() => deleteTodo(todo.id)} style={{ background: 'none', border: 'none', color: '#e53e3e', fontWeight: 600, cursor: 'pointer', fontSize: 14, marginLeft: 4, whiteSpace: 'nowrap' }}>Delete</button>
                  </>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
