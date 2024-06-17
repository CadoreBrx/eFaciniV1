import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import api from '../../services/api'; // Importando o serviço de API

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '2rem',
    [theme.breakpoints.down('sm')]: {
      margin: '1rem',
    },
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
      flexDirection: 'row',
    },
  },
  input: {
    marginBottom: '1rem',
    [theme.breakpoints.up('md')]: {
      flexGrow: 1,
      marginRight: '1rem',
      marginBottom: 0,
    },
  },
  listContainer: {
    width: '100%',
    height: '100%',
    marginTop: '1rem',
    backgroundColor: '#f5f5f5',
    borderRadius: '5px',
  },
  list: {
    marginBottom: '5px',
  },
  lowPriority: {
    backgroundColor: '#e0f7fa',
  },
  mediumPriority: {
    backgroundColor: '#fff9c4',
  },
  highPriority: {
    backgroundColor: '#ffcdd2',
  },
}));

const ToDoList = () => {
  const classes = useStyles();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('baixa');
  const [dueDate, setDueDate] = useState('');
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users/');
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleDueDateChange = (event) => {
    setDueDate(event.target.value);
  };

  const handleUserChange = (event) => {
    setUser(event.target.value);
  };

  const handleAddTask = () => {
    if (!title.trim() || !description.trim() || !user.trim()) {
      return;
    }

    const now = new Date();
    if (editIndex >= 0) {
      const newTasks = [...tasks];
      newTasks[editIndex] = { title, description, priority, dueDate, user, updatedAt: now, createdAt: newTasks[editIndex].createdAt };
      setTasks(newTasks);
      setTitle('');
      setDescription('');
      setPriority('baixa');
      setDueDate('');
      setUser('');
      setEditIndex(-1);
    } else {
      setTasks([...tasks, { title, description, priority, dueDate, user, createdAt: now, updatedAt: now }]);
      setTitle('');
      setDescription('');
      setPriority('baixa');
      setDueDate('');
      setUser('');
    }
  };

  const handleEditTask = (index) => {
    const { title, description, priority, dueDate, user } = tasks[index];
    setTitle(title);
    setDescription(description);
    setPriority(priority);
    setDueDate(dueDate);
    setUser(user);
    setEditIndex(index);
  };

  const handleDeleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'baixa':
        return classes.lowPriority;
      case 'media':
        return classes.mediumPriority;
      case 'alta':
        return classes.highPriority;
      default:
        return '';
    }
  };

  return (
    <div className={classes.root}>
      <div className={classes.inputContainer}>
        <TextField
          className={classes.input}
          label="Título"
          value={title}
          onChange={handleTitleChange}
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Descrição"
          value={description}
          onChange={handleDescriptionChange}
          variant="outlined"
        />
        <TextField
          select
          label="Prioridade"
          value={priority}
          onChange={handlePriorityChange}
          variant="outlined"
          className={classes.input}
        >
          <MenuItem value="baixa">Baixa</MenuItem>
          <MenuItem value="media">Média</MenuItem>
          <MenuItem value="alta">Alta</MenuItem>
        </TextField>
        <TextField
          label="Data de realização"
          type="date"
          value={dueDate}
          onChange={handleDueDateChange}
          InputLabelProps={{
            shrink: true,
          }}
          className={classes.input}
        />
        <FormControl variant="outlined" className={classes.input}>
          <InputLabel>Usuário</InputLabel>
          <Select
            value={user}
            onChange={handleUserChange}
            label="Usuário"
          >
            {users.map((user) => (
              <MenuItem key={user.id} value={user.name}>{user.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleAddTask}>
          {editIndex >= 0 ? 'Salvar' : 'Adicionar'}
        </Button>
      </div>
      <div className={classes.listContainer}>
        <List>
          {tasks.map((task, index) => (
            <ListItem key={index} className={`${classes.list} ${getPriorityClass(task.priority)}`}>
              <ListItemText
                primary={task.title}
                secondary={`${task.description} - ${task.priority}, ${task.dueDate ? `Realizar em: ${task.dueDate}` : 'Sem data'} - Atualizado em: ${new Date(task.updatedAt).toLocaleString()} - Usuário: ${task.user}`}
              />
              <ListItemSecondaryAction>
                <IconButton onClick={() => handleEditTask(index)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteTask(index)}>
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </div>
    </div>
  );
};

export default ToDoList;
