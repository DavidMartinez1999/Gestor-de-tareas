
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Calendar, 
  LogOut, 
  Settings,
  Plus,
  Search,
  Filter,
  Upload,
  Download,
  MessageSquare,
  Trash2,
  Edit,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [currentView, setCurrentView] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  // Datos de prueba
  useEffect(() => {
    const sampleTasks = [
      {
        id: 1,
        title: 'Ensayo sobre el cuerpo humano',
        description: 'Elabora un ensayo detallado sobre los sistemas del cuerpo humano',
        dueDate: '2024-01-15',
        course: 'Biología',
        status: 'pending',
        priority: 'high',
        createdBy: 'profesor@ejemplo.com'
      },
      {
        id: 2,
        title: 'Análisis de datos estadísticos',
        description: 'Realizar un análisis completo de los datos proporcionados',
        dueDate: '2024-01-20',
        course: 'Matemáticas',
        status: 'completed',
        priority: 'medium',
        createdBy: 'profesor@ejemplo.com'
      }
    ];

    const sampleSubmissions = [
      {
        id: 1,
        taskId: 1,
        studentEmail: 'estudiante@ejemplo.com',
        fileName: 'ensayo_biologia.pdf',
        submittedAt: '2024-01-10',
        comments: 'Excelente trabajo, muy detallado.',
        grade: 95
      }
    ];

    const sampleStudents = [
      {
        email: 'estudiante@ejemplo.com',
        name: 'Juan Pérez',
        course: '6°1'
      },
      {
        email: 'maria@ejemplo.com',
        name: 'María García',
        course: '6°1'
      }
    ];

    const sampleCourses = [
      { id: '6-1', name: '6°1' },
      { id: '6-2', name: '6°2' },
      { id: '7-1', name: '7°1' }
    ];

    setTasks(sampleTasks);
    setSubmissions(sampleSubmissions);
    setStudents(sampleStudents);
    setCourses(sampleCourses);
  }, []);

  const handleLogin = (email, password) => {
    // Credenciales de prueba
    const credentials = {
      'profesor@ejemplo.com': { password: '123456', role: 'teacher', name: 'Profesor Ejemplo' },
      'estudiante@ejemplo.com': { password: '123456', role: 'student', name: 'Juan Pérez' }
    };

    if (credentials[email] && credentials[email].password === password) {
      setUser({
        email,
        role: credentials[email].role,
        name: credentials[email].name
      });
      setCurrentView(credentials[email].role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
      toast({
        title: "¡Bienvenido!",
        description: `Has iniciado sesión como ${credentials[email].role === 'teacher' ? 'docente' : 'estudiante'}.`,
      });
    } else {
      toast({
        title: "Error de autenticación",
        description: "Credenciales incorrectas. Intenta de nuevo.",
        variant: "destructive",
      });
    }
  };

  const handleRegister = (email, password, name, role) => {
    // Simulación de registro
    setUser({ email, role, name });
    setCurrentView(role === 'teacher' ? 'teacher-dashboard' : 'student-dashboard');
    toast({
      title: "¡Registro exitoso!",
      description: `Te has registrado como ${role === 'teacher' ? 'docente' : 'estudiante'}.`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('login');
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión exitosamente.",
    });
  };

  const createTask = (taskData) => {
    const newTask = {
      id: Date.now(),
      ...taskData,
      status: 'pending',
      createdBy: user.email
    };
    setTasks([...tasks, newTask]);
    setIsCreateTaskOpen(false);
    toast({
      title: "Tarea creada",
      description: "La tarea ha sido creada exitosamente.",
    });
  };

  const submitTask = (taskId, file, comments) => {
    const newSubmission = {
      id: Date.now(),
      taskId,
      studentEmail: user.email,
      fileName: file.name,
      submittedAt: new Date().toISOString().split('T')[0],
      comments: comments || '',
      grade: null
    };
    setSubmissions([...submissions, newSubmission]);
    setIsUploadOpen(false);
    toast({
      title: "Tarea entregada",
      description: "Tu tarea ha sido entregada exitosamente.",
    });
  };

  const deleteSubmission = (submissionId) => {
    setSubmissions(submissions.filter(s => s.id !== submissionId));
    toast({
      title: "Entrega eliminada",
      description: "La entrega ha sido eliminada exitosamente.",
    });
  };

  const addComment = (submissionId, comment) => {
    setSubmissions(submissions.map(s => 
      s.id === submissionId ? { ...s, comments: comment } : s
    ));
    setIsCommentOpen(false);
    toast({
      title: "Comentario agregado",
      description: "El comentario ha sido agregado exitosamente.",
    });
  };

  const getTaskStatus = (task) => {
    const submission = submissions.find(s => s.taskId === task.id && s.studentEmail === user?.email);
    const isOverdue = new Date(task.dueDate) < new Date();
    
    if (submission) return 'completed';
    if (isOverdue) return 'overdue';
    return 'pending';
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (user?.role === 'student') {
      const status = getTaskStatus(task);
      const matchesFilter = filterStatus === 'all' || status === filterStatus;
      return matchesSearch && matchesFilter;
    }
    
    return matchesSearch;
  });

  const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleLogin(email, password);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Gestor de Tareas</CardTitle>
            <CardDescription className="text-white/80">
              Inicia sesión para continuar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="********"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full floating-button text-white">
                Iniciar Sesión
              </Button>
            </form>
            <div className="mt-6 text-center text-white/80 text-sm">
              <p>Credenciales de prueba:</p>
              <p>Profesor: profesor@ejemplo.com / Contraseña: 123456</p>
              <p>Estudiante: estudiante@ejemplo.com / Contraseña: 123456</p>
              <p>(Curso: 6°1)</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');

    const handleSubmit = (e) => {
      e.preventDefault();
      handleRegister(email, password, name, role);
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="glass-card border-white/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">Registro</CardTitle>
            <CardDescription className="text-white/80">
              Crea tu cuenta nueva
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nombre Completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Tu nombre completo"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pr-10"
                    placeholder="********"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-white">Tipo de Usuario</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="input-field">
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Estudiante</SelectItem>
                    <SelectItem value="teacher">Docente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full floating-button text-white">
                Registrarse
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const Sidebar = ({ activeView, onViewChange }) => {
    const teacherMenuItems = [
      { id: 'teacher-dashboard', label: 'Panel Principal', icon: Home },
      { id: 'all-courses', label: 'Todos los Cursos', icon: BookOpen },
      { id: 'calendar', label: 'Calendario', icon: Calendar },
    ];

    const studentMenuItems = [
      { id: 'student-dashboard', label: 'Área Personal', icon: User },
      { id: 'main-page', label: 'Página Principal', icon: Home },
      { id: 'all-courses', label: 'Todos los Cursos', icon: BookOpen },
      { id: 'calendar', label: 'Calendario', icon: Calendar },
    ];

    const menuItems = user?.role === 'teacher' ? teacherMenuItems : studentMenuItems;

    return (
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-6 min-h-screen"
      >
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">GT</span>
          </div>
          <div>
            <h2 className="font-bold">Gestor de Tareas</h2>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg sidebar-item ${
                activeView === item.id ? 'bg-white/20' : ''
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 p-3 rounded-lg sidebar-item text-red-300 hover:bg-red-500/20"
          >
            <LogOut className="h-5 w-5" />
            <span>Cerrar Sesión</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 rounded-lg sidebar-item">
            <Settings className="h-5 w-5" />
            <span>Eliminar Cuenta</span>
          </button>
        </div>
      </motion.div>
    );
  };

  const TeacherDashboard = () => {
    const [newTask, setNewTask] = useState({
      title: '',
      description: '',
      dueDate: '',
      course: '',
      priority: 'medium'
    });

    const handleCreateTask = (e) => {
      e.preventDefault();
      createTask(newTask);
      setNewTask({ title: '', description: '', dueDate: '', course: '', priority: 'medium' });
    };

    return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600">Panel del Docente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Crear Nueva Tarea */}
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-indigo-600" />
                <span>Crear Nueva Tarea</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Ej: Ensayo sobre el cuerpo humano"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Elabora un ensayo detallado..."
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dueDate">Fecha Límite</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">Asignado a</Label>
                    <Select value={newTask.course} onValueChange={(value) => setNewTask({...newTask, course: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un curso" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.name}>
                            {course.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Prioridad</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baja</SelectItem>
                      <SelectItem value="medium">Media</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full floating-button">
                  Crear Tarea
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Tareas Entregadas */}
          <Card className="task-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-green-600" />
                <span>Tareas Entregadas por Estudiantes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {submissions.map((submission) => {
                  const task = tasks.find(t => t.id === submission.taskId);
                  const student = students.find(s => s.email === submission.studentEmail);
                  return (
                    <div key={submission.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{task?.title}</h4>
                          <p className="text-sm text-gray-600">Por: {student?.name}</p>
                          <p className="text-sm text-gray-500">Entregado: {submission.submittedAt}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Agregar Comentario</DialogTitle>
                              </DialogHeader>
                              <Textarea placeholder="Escribe tu comentario aquí..." />
                              <DialogFooter>
                                <Button onClick={() => addComment(submission.id, "Comentario agregado")}>
                                  Agregar Comentario
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {submission.comments && (
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <strong>Comentario:</strong> {submission.comments}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buscar Estudiante */}
        <Card className="task-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span>Buscar Estudiante</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4 mb-4">
              <Input
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
              <Button variant="outline">
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students
                .filter(student => student.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((student) => (
                <div key={student.email} className="border rounded-lg p-4">
                  <h4 className="font-semibold">{student.name}</h4>
                  <p className="text-sm text-gray-600">{student.email}</p>
                  <p className="text-sm text-gray-500">Curso: {student.course}</p>
                  <Button size="sm" className="mt-2" variant="outline">
                    Ver Trabajos
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const StudentDashboard = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadComments, setUploadComments] = useState('');

    const handleFileUpload = (taskId) => {
      if (selectedFile) {
        submitTask(taskId, selectedFile, uploadComments);
        setSelectedFile(null);
        setUploadComments('');
      }
    };

    const studentTasks = filteredTasks;
    const pendingTasks = studentTasks.filter(task => getTaskStatus(task) === 'pending');

    return (
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bienvenido, {user?.name}
          </h1>
          <p className="text-gray-600">Panel del Estudiante</p>
        </div>

        {/* Filtros */}
        <div className="flex space-x-4 mb-6">
          <Input
            placeholder="Buscar tareas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las tareas</SelectItem>
              <SelectItem value="pending">Pendientes</SelectItem>
              <SelectItem value="completed">Entregadas</SelectItem>
              <SelectItem value="overdue">Vencidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tareas Pendientes */}
        <Card className="task-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-orange-600" />
              <span>Tareas Pendientes ({pendingTasks.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTasks
                .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                .map((task) => {
                  const status = getTaskStatus(task);
                  const submission = submissions.find(s => s.taskId === task.id && s.studentEmail === user?.email);
                  
                  return (
                    <div key={task.id} className={`border rounded-lg p-4 ${task.priority === 'high' ? 'priority-high' : task.priority === 'medium' ? 'priority-medium' : 'priority-low'}`}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{task.title}</h4>
                        <Badge className={status === 'completed' ? 'status-completed' : status === 'overdue' ? 'status-overdue' : 'status-pending'}>
                          {status === 'completed' ? 'Entregada' : status === 'overdue' ? 'Vencida' : 'Pendiente'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                      <p className="text-sm text-gray-500 mb-3">Vence: {task.dueDate}</p>
                      <p className="text-sm text-gray-500 mb-3">Curso: {task.course}</p>
                      
                      {!submission && status !== 'overdue' && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="w-full">
                              <Upload className="h-4 w-4 mr-2" />
                              Subir Trabajo
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Subir Trabajo - {task.title}</DialogTitle>
                              <DialogDescription>
                                Selecciona el archivo y agrega comentarios si es necesario.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="file">Archivo</Label>
                                <Input
                                  id="file"
                                  type="file"
                                  onChange={(e) => setSelectedFile(e.target.files[0])}
                                  accept=".pdf,.doc,.docx,.txt"
                                />
                              </div>
                              <div>
                                <Label htmlFor="comments">Comentarios (opcional)</Label>
                                <Textarea
                                  id="comments"
                                  value={uploadComments}
                                  onChange={(e) => setUploadComments(e.target.value)}
                                  placeholder="Agrega comentarios sobre tu entrega..."
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button onClick={() => handleFileUpload(task.id)} disabled={!selectedFile}>
                                Subir Trabajo
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}

                      {submission && (
                        <div className="space-y-2">
                          <div className="bg-green-50 p-2 rounded text-sm">
                            <strong>Entregado:</strong> {submission.fileName}
                          </div>
                          {submission.comments && (
                            <div className="bg-blue-50 p-2 rounded text-sm">
                              <strong>Comentarios del docente:</strong> {submission.comments}
                            </div>
                          )}
                          {status !== 'overdue' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteSubmission(submission.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Eliminar
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="outline">
                                    <Upload className="h-4 w-4 mr-1" />
                                    Resubir
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Resubir Trabajo</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <Input
                                      type="file"
                                      onChange={(e) => setSelectedFile(e.target.files[0])}
                                      accept=".pdf,.doc,.docx,.txt"
                                    />
                                    <Textarea
                                      value={uploadComments}
                                      onChange={(e) => setUploadComments(e.target.value)}
                                      placeholder="Comentarios sobre la nueva versión..."
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={() => {
                                      deleteSubmission(submission.id);
                                      handleFileUpload(task.id);
                                    }} disabled={!selectedFile}>
                                      Resubir Trabajo
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* Todas las Tareas Asignadas */}
        <Card className="task-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span>Ver Tareas Asignadas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {studentTasks.map((task) => {
                const status = getTaskStatus(task);
                const submission = submissions.find(s => s.taskId === task.id && s.studentEmail === user?.email);
                
                return (
                  <div key={task.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                          <span>Vence: {task.dueDate}</span>
                          <span>Curso: {task.course}</span>
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={status === 'completed' ? 'status-completed' : status === 'overdue' ? 'status-overdue' : 'status-pending'}>
                          {status === 'completed' ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Entregada
                            </>
                          ) : status === 'overdue' ? (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Vencida
                            </>
                          ) : (
                            <>
                              <Clock className="h-3 w-3 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                    {submission && submission.comments && (
                      <div className="mt-3 bg-blue-50 p-3 rounded">
                        <h5 className="font-medium text-sm">Comentarios del docente:</h5>
                        <p className="text-sm mt-1">{submission.comments}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="gradient-bg">
      <Toaster />
      
      {currentView === 'login' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentView('login')}
            >
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentView('register')}
            >
              <User className="h-4 w-4 mr-2" />
              Registrarse
            </Button>
          </div>
          <LoginForm />
        </div>
      )}

      {currentView === 'register' && (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="absolute top-4 right-4 space-x-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentView('login')}
            >
              <User className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setCurrentView('register')}
            >
              <User className="h-4 w-4 mr-2" />
              Registrarse
            </Button>
          </div>
          <RegisterForm />
        </div>
      )}

      {(currentView === 'teacher-dashboard' || currentView === 'student-dashboard') && (
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar activeView={currentView} onViewChange={setCurrentView} />
          {user?.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />}
        </div>
      )}
    </div>
  );
}

export default App;
