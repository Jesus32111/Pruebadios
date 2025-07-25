import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Wrench,
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { apiClient } from '../context/AuthContext';

interface Machinery {
  _id: string;
  brand: string;
  model: string;
  serialNumber: string;
  type: string;
  year: number;
  status: 'Disponible' | 'Alquilada' | 'En Mantenimiento' | 'Fuera de Servicio';
  hourMeter: number;
  description?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location?: string;
  compatibleParts?: Array<{
    partName: string;
    partNumber: string;
    supplier: string;
  }>;
  maintenanceHistory?: Array<{
    date: string;
    type: 'Preventivo' | 'Correctivo' | 'Inspección';
    description: string;
    cost?: number;
    technician?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const MachineryModule: React.FC = () => {
  const [machineries, setMachineries] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState<Machinery | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    type: 'Otro',
    year: new Date().getFullYear(),
    status: 'Disponible',
    hourMeter: 0,
    description: '',
    purchaseDate: '',
    purchasePrice: '',
    location: ''
  });

  const machineryTypes = [
    'Excavadora', 'Bulldozer', 'Grúa', 'Cargadora', 'Compactadora', 
    'Retroexcavadora', 'Motoniveladora', 'Volquete', 'Otro'
  ];

  const statusOptions = [
    'Disponible', 'Alquilada', 'En Mantenimiento', 'Fuera de Servicio'
  ];

  useEffect(() => {
    fetchMachineries();
  }, []);

  const fetchMachineries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching machineries with filters:', {
        status: statusFilter !== 'all' ? statusFilter : undefined,
        type: typeFilter !== 'all' ? typeFilter : undefined,
        search: searchTerm || undefined
      });

      const response = await apiClient.get('/machinery', {
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          type: typeFilter !== 'all' ? typeFilter : undefined,
          search: searchTerm || undefined
        }
      });
      
      console.log('Machineries fetched successfully:', response.data);
      setMachineries(response.data.data || []);
    } catch (error: any) {
      console.error('Error fetching machineries:', error);
      const errorMessage = error.response?.data?.message || 'Error al cargar las maquinarias';
      setError(errorMessage);
      setMachineries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchMachineries();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter, typeFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const submitData = {
        ...formData,
        year: parseInt(formData.year.toString()),
        hourMeter: parseFloat(formData.hourMeter.toString()) || 0,
        purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice.toString()) : undefined,
        purchaseDate: formData.purchaseDate || undefined
      };

      console.log('Submitting machinery data:', submitData);

      if (editingMachinery) {
        await apiClient.put(`/machinery/${editingMachinery._id}`, submitData);
        console.log('Machinery updated successfully');
      } else {
        await apiClient.post('/machinery', submitData);
        console.log('Machinery created successfully');
      }

      setShowForm(false);
      setEditingMachinery(null);
      resetForm();
      fetchMachineries();
    } catch (error: any) {
      console.error('Error saving machinery:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar la maquinaria';
      setError(errorMessage);
    }
  };

  const handleEdit = (machinery: Machinery) => {
    setEditingMachinery(machinery);
    setFormData({
      brand: machinery.brand,
      model: machinery.model,
      serialNumber: machinery.serialNumber,
      type: machinery.type,
      year: machinery.year,
      status: machinery.status,
      hourMeter: machinery.hourMeter,
      description: machinery.description || '',
      purchaseDate: machinery.purchaseDate ? machinery.purchaseDate.split('T')[0] : '',
      purchasePrice: machinery.purchasePrice?.toString() || '',
      location: machinery.location || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta maquinaria?')) {
      try {
        setError(null);
        await apiClient.delete(`/machinery/${id}`);
        console.log('Machinery deleted successfully');
        fetchMachineries();
      } catch (error: any) {
        console.error('Error deleting machinery:', error);
        const errorMessage = error.response?.data?.message || 'Error al eliminar la maquinaria';
        setError(errorMessage);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      brand: '',
      model: '',
      serialNumber: '',
      type: 'Otro',
      year: new Date().getFullYear(),
      status: 'Disponible',
      hourMeter: 0,
      description: '',
      purchaseDate: '',
      purchasePrice: '',
      location: ''
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Disponible':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Alquilada':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'En Mantenimiento':
        return <Wrench className="h-5 w-5 text-yellow-500" />;
      case 'Fuera de Servicio':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-100 text-green-800';
      case 'Alquilada':
        return 'bg-blue-100 text-blue-800';
      case 'En Mantenimiento':
        return 'bg-yellow-100 text-yellow-800';
      case 'Fuera de Servicio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-gray-600">Cargando maquinarias...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Maquinarias</h1>
          <p className="text-gray-600">Administra tu flota de maquinarias</p>
        </div>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingMachinery(null);
            resetForm();
            setError(null);
          }}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Maquinaria
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar maquinarias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los estados</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos los tipos</option>
            {machineryTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="flex items-center text-sm text-gray-600">
            <Filter className="h-4 w-4 mr-2" />
            {machineries.length} maquinaria{machineries.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <XCircle className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Machinery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {machineries.map((machinery) => (
          <div key={machinery._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {machinery.brand} {machinery.model}
                  </h3>
                  <p className="text-sm text-gray-600">S/N: {machinery.serialNumber}</p>
                </div>
                <div className="flex items-center space-x-1">
                  {getStatusIcon(machinery.status)}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Wrench className="h-4 w-4 mr-2" />
                  {machinery.type} - {machinery.year}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  {machinery.hourMeter.toLocaleString()} horas
                </div>
                {machinery.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {machinery.location}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(machinery.status)}`}>
                  {machinery.status}
                </span>
                {machinery.purchasePrice && (
                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="h-4 w-4 mr-1" />
                    ${machinery.purchasePrice.toLocaleString()}
                  </div>
                )}
              </div>

              {machinery.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {machinery.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(machinery)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(machinery._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(machinery.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {machineries.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <Wrench className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay maquinarias</h3>
          <p className="text-gray-600 mb-6">Comienza agregando tu primera maquinaria</p>
          <button
            onClick={() => {
              setShowForm(true);
              setEditingMachinery(null);
              resetForm();
              setError(null);
            }}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Maquinaria
          </button>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowForm(false)} />
            
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingMachinery ? 'Editar Maquinaria' : 'Nueva Maquinaria'}
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Marca *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: Caterpillar"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Modelo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: 320D"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Serie *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ej: ABC123456"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {machineryTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año *
                    </label>
                    <input
                      type="number"
                      required
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horómetro
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={formData.hourMeter}
                      onChange={(e) => setFormData({ ...formData, hourMeter: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Horas de uso"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ubicación actual"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Compra
                    </label>
                    <input
                      type="date"
                      value={formData.purchaseDate}
                      onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio de Compra
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Precio en USD"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Descripción adicional de la maquinaria..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingMachinery ? 'Actualizar' : 'Crear'} Maquinaria
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MachineryModule;