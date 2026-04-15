/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  LogOut, 
  Ticket as TicketIcon, 
  Search,
  Filter,
  User as UserIcon,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc, 
  Timestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { AuthProvider, useAuth } from './AuthContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Toaster, toast } from 'sonner';

interface Ticket {
  id: string;
  title: string;
  status: 'pending' | 'resolved';
  createdAt: Timestamp;
  userId: string;
  authorName?: string;
}

function TicketApp() {
  const { user, isAdmin, signIn, logout, loading: authLoading } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setTickets([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ticketList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Ticket[];
      setTickets(ticketList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'tickets');
    });

    return () => unsubscribe();
  }, [user]);

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim() || !user) return;

    try {
      await addDoc(collection(db, 'tickets'), {
        title: newTicketTitle,
        status: 'pending',
        createdAt: Timestamp.now(),
        userId: user.uid,
        authorName: user.displayName || user.email
      });
      setNewTicketTitle('');
      toast.success('Ticket creado correctamente');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'tickets');
    }
  };

  const handleToggleStatus = async (ticket: Ticket) => {
    if (!user || (!isAdmin && ticket.userId !== user.uid)) {
      toast.error('No tienes permiso para modificar este ticket');
      return;
    }

    const newStatus = ticket.status === 'pending' ? 'resolved' : 'pending';
    try {
      await updateDoc(doc(db, 'tickets', ticket.id), {
        status: newStatus
      });
      toast.success(`Ticket marcado como ${newStatus === 'resolved' ? 'resuelto' : 'pendiente'}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `tickets/${ticket.id}`);
    }
  };

  const handleDeleteTicket = async (ticket: Ticket) => {
    if (!user || (!isAdmin && ticket.userId !== user.uid)) {
      toast.error('No tienes permiso para eliminar este ticket');
      return;
    }

    try {
      await deleteDoc(doc(db, 'tickets', ticket.id));
      toast.success('Ticket eliminado');
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `tickets/${ticket.id}`);
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (t.authorName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <Card className="border-none shadow-xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200">
                <TicketIcon className="w-8 h-8 text-white" />
              </div>
              <div className="space-y-2">
                <CardTitle className="text-3xl font-bold tracking-tight">SupportFlow Pro</CardTitle>
                <CardDescription className="text-base">
                  Gestiona tus tickets de soporte con eficiencia y estilo.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button onClick={signIn} className="w-full h-12 text-lg font-medium bg-blue-600 hover:bg-blue-700">
                Iniciar sesión con Google
              </Button>
              <p className="text-center text-sm text-slate-500">
                Acceso seguro para el equipo de soporte y clientes.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-bottom border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <TicketIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">SupportFlow Pro</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-full">
              {isAdmin ? (
                <ShieldCheck className="w-4 h-4 text-blue-600" />
              ) : (
                <UserIcon className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-sm font-medium max-w-[120px] truncate">
                {user.displayName || user.email}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={logout} className="text-slate-500 hover:text-red-600">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Welcome & Stats */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Panel de Control</h1>
            <p className="text-slate-500">Bienvenido de nuevo. Aquí tienes un resumen de los tickets.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white px-3 py-1">
              Total: {tickets.length}
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1">
              Pendientes: {tickets.filter(t => t.status === 'pending').length}
            </Badge>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* New Ticket Form */}
          <div className="lg:col-span-4">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-xl">Nuevo Ticket</CardTitle>
                <CardDescription>Describe el problema o solicitud.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddTicket} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Ej: Error en el login de la app"
                      value={newTicketTitle}
                      onChange={(e) => setNewTicketTitle(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Crear Ticket
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Ticket List */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Buscar tickets..." 
                  className="pl-9 bg-slate-50 border-none focus-visible:ring-1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <Filter className="w-4 h-4 text-slate-400 mr-1 shrink-0" />
                {(['all', 'pending', 'resolved'] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className={`capitalize h-8 px-4 ${filter === f ? 'bg-slate-900' : 'text-slate-600'}`}
                  >
                    {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendientes' : 'Resueltos'}
                  </Button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="space-y-4">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin mb-2" />
                  <p>Cargando tickets...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <Card className="border-dashed border-2 bg-slate-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="bg-slate-200 p-4 rounded-full mb-4">
                      <Search className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold">No se encontraron tickets</h3>
                    <p className="text-slate-500 max-w-xs">
                      {searchQuery ? 'Prueba con otros términos de búsqueda.' : '¡Todo está al día! No hay tickets que mostrar.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className={`group transition-all hover:shadow-md ${ticket.status === 'resolved' ? 'bg-slate-50/80 border-slate-200' : 'bg-white border-slate-200'}`}>
                        <CardContent className="p-5 flex items-start justify-between gap-4">
                          <div className="flex gap-4">
                            <div className={`mt-1 p-2 rounded-lg shrink-0 ${ticket.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                              {ticket.status === 'resolved' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                            </div>
                            <div className="space-y-1">
                              <h3 className={`font-semibold text-lg leading-tight ${ticket.status === 'resolved' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                {ticket.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                  <UserIcon className="w-3 h-3" />
                                  {ticket.authorName || 'Usuario'}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {ticket.createdAt?.toDate().toLocaleString('es-ES', { 
                                    day: '2-digit', 
                                    month: 'short', 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                  })}
                                </span>
                                <Badge variant={ticket.status === 'resolved' ? 'secondary' : 'outline'} className="h-5 px-2 capitalize">
                                  {ticket.status === 'pending' ? 'Pendiente' : 'Resuelto'}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {isAdmin && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleToggleStatus(ticket)}
                                  className={ticket.status === 'resolved' ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}
                                  title={ticket.status === 'resolved' ? 'Reabrir ticket' : 'Marcar como resuelto'}
                                >
                                  {ticket.status === 'resolved' ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleDeleteTicket(ticket)}
                                  className="text-slate-400 hover:text-red-600 hover:bg-red-50"
                                  title="Eliminar ticket"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              ) }
            </div>
          </div>
        </div>
      </main>
      <Toaster position="bottom-right" />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TicketApp />
      </AuthProvider>
    </ErrorBoundary>
  );
}
