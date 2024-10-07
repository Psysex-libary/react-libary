import React, { createContext, useContext, useEffect, useState } from 'react';

const TaskContext = createContext();

const TaskProvider = ({ children }) => {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('https://jsonplaceholder.typicode.com/todos');
            const data = await response.json();
            setTasks(data.slice(0, 10));
        };
        fetchTasks();
    }, []);

    const addTask = (task) => {
        setTasks((prevTasks) => [...prevTasks, task]);
    };

    const removeTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== id));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, removeTask }}>
            {children}
        </TaskContext.Provider>
    );
};

const TaskList = () => {
    const { tasks, removeTask } = useContext(TaskContext);

    return (
        <div>
            <h2>Aufgabenliste</h2>
            <ul>
                {tasks.map(task => (
                    <li key={task.id}>
                        {task.title}
                        <button onClick={() => removeTask(task.id)}>Entfernen</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const AddTaskForm = () => {
    const { addTask } = useContext(TaskContext);
    const [title, setTitle] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newTask = { id: Date.now(), title };
        addTask(newTask);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                placeholder="Neue Aufgabe" 
                required 
            />
            <button type="submit">Hinzufügen</button>
        </form>
    );
};

const App = () => {
    return (
        <TaskProvider>
            <div>
                <h1>Aufgabenverwaltung</h1>
                <AddTaskForm />
                <TaskList />
            </div>
        </TaskProvider>
    );
};

export default App;
