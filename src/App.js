import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, IconButton, Checkbox, Snackbar, Typography, MenuItem, Select } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import MuiAlert from '@mui/material/Alert';

const theme = createTheme();

function App() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const [editIndex, setEditIndex] = useState(null);
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('default');
    const [deadline, setDeadline] = useState('');
    const [stats, setStats] = useState({ completed: 0, total: 0 });

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem('tasks'));
        if (storedTasks) {
            setTasks(storedTasks);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const completed = tasks.filter(task => task.completed).length;
        setStats({ completed, total: tasks.length });
    }, [tasks]);

    const handleAddTask = () => {
        if (task.trim() !== '') {
            if (editIndex !== null) {
                const newTasks = tasks.map((t, index) => index === editIndex ? { ...t, text: task, deadline } : t);
                setTasks(newTasks);
                setEditIndex(null);
                setSnackbarMessage('Task edited');
            } else {
                setTasks([...tasks, { text: task, completed: false, deadline }]);
                setSnackbarMessage('Task added');
            }
            setTask('');
            setDeadline('');
            setOpen(true);
        }
    };

    const handleEditTask = (index) => {
        setTask(tasks[index].text);
        setDeadline(tasks[index].deadline);
        setEditIndex(index);
    };

    const handleDeleteTask = (index) => {
        const newTasks = tasks.filter((_, i) => i !== index);
        setTasks(newTasks);
        setSnackbarMessage('Task deleted');
        setOpen(true);
    };

    const handleToggleTask = (index) => {
        const newTasks = tasks.map((task, i) => {
            if (i === index) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        setTasks(newTasks);
    };

    const handleCloseSnackbar = () => {
        setOpen(false);
    };

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    const handleSortChange = (event) => {
        setSort(event.target.value);
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'notCompleted') return !task.completed;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sort === 'alphabetical') return a.text.localeCompare(b.text);
        if (sort === 'completed') return a.completed === b.completed ? 0 : a.completed ? 1 : -1;
        return 0;
    });

    const getTaskColor = (deadline) => {
        const now = new Date();
        const taskDate = new Date(deadline);
        if (taskDate < now) return 'red';
        if (taskDate - now < 24 * 60 * 60 * 1000) return 'orange'; // менее чем за 24 часа
        return 'black';
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
                <Typography variant="h4" gutterBottom>To-Do List</Typography>
                <TextField
                    label="New Task"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                />
                <TextField
                    label="Deadline"
                    type="datetime-local"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <Button variant="contained" color="primary" onClick={handleAddTask}>
                    {editIndex !== null ? 'Edit Task' : 'Add Task'}
                </Button>
                <Select
                    value={filter}
                    onChange={handleFilterChange}
                    displayEmpty
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="notCompleted">Not Completed</MenuItem>
                </Select>
                <Select
                    value={sort}
                    onChange={handleSortChange}
                    displayEmpty
                    fullWidth
                    style={{ marginTop: '1rem' }}
                >
                    <MenuItem value="default">Default</MenuItem>
                    <MenuItem value="alphabetical">Alphabetical</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                </Select>
                <List>
                    {sortedTasks.map((task, index) => (
                        <ListItem key={index} secondaryAction={
                            <>
                                <Checkbox
                                    edge="start"
                                    checked={task.completed}
                                    tabIndex={-1}
                                    disableRipple
                                    onChange={() => handleToggleTask(index)}
                                />
                                <IconButton edge="end" aria-label="edit" onClick={() => handleEditTask(index)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteTask(index)}>
                                    <DeleteIcon />
                                </IconButton>
                            </>
                        }>
                            <ListItemText primary={task.text} secondary={task.deadline} style={{ color: getTaskColor(task.deadline), textDecoration: task.completed ? 'line-through' : 'none' }} />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="body1" gutterBottom>
                    {`Completed tasks: ${stats.completed}/${stats.total}`}
                </Typography>
                <Snackbar open={open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                    <MuiAlert elevation={6} variant="filled" onClose={handleCloseSnackbar} severity="success">
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>
            </Container>
        </ThemeProvider>
    );
}

export default App;
