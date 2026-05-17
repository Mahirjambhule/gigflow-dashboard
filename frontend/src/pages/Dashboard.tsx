import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import { Lead, LeadsResponse } from '../types/lead';
import { Search, Download, Trash2, Loader2, FilterX, Plus, Edit, Eye } from 'lucide-react';
import { LeadFormModal } from '../components/LeadFormModal';
import { LeadDetailsModal } from '../components/LeadDetailsModal';

export const Dashboard = () => {
  const { user } = useAuth();
  
  // Data State
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter & Pagination State
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  const [sort, setSort] = useState('Latest');
  const [page, setPage] = useState(1);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch Data Function
  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        sort,
        ...(status && { status }),
        ...(source && { source }),
        ...(debouncedSearch && { search: debouncedSearch }),
      });

      const response = await api.get<LeadsResponse>(`/leads?${params.toString()}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    } finally {
      setIsLoading(false);
    }
  }, [page, sort, status, source, debouncedSearch]);

  // Re-fetch when filters/pagination change
  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Reset page to 1 when user types a new search or changes a filter
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status, source]);

  // 2. CSV Export Logic
  const exportToCSV = () => {
    if (!data?.leads.length) return;
    
    const headers = ['Name', 'Email', 'Status', 'Source', 'Date Created'];
    const csvRows = data.leads.map(lead => 
      `${lead.name},${lead.email},${lead.status},${lead.source},${new Date(lead.createdAt).toLocaleDateString()}`
    );
    
    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'gigflow_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 3. Delete Logic (Admin Only)
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      try {
        await api.delete(`/leads/${id}`);
        fetchLeads();
      } catch (error) {
        alert('Failed to delete lead. You may not have permission.');
      }
    }
  };

  // 4. Create/Update Logic
  const handleFormSubmit = async (formData: any) => {
    setIsSubmitting(true);
    try {
      if (selectedLead) {
        // Update Existing
        await api.put(`/leads/${selectedLead._id}`, formData);
      } else {
        // Create New
        await api.post('/leads', formData);
      }
      setIsFormOpen(false);
      fetchLeads(); // Refresh table data
    } catch (error) {
      alert('Error saving lead. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status Badge Helper
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Contacted': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Qualified': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'Lost': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and track your incoming leads.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={exportToCSV}
            disabled={!data?.leads.length}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Export CSV
          </button>
          
          <button 
            onClick={() => { setSelectedLead(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white"
          />
        </div>

        <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
          <option value="">All Statuses</option>
          <option value="New">New</option>
          <option value="Contacted">Contacted</option>
          <option value="Qualified">Qualified</option>
          <option value="Lost">Lost</option>
        </select>

        <select value={source} onChange={(e) => setSource(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
          <option value="">All Sources</option>
          <option value="Website">Website</option>
          <option value="Instagram">Instagram</option>
          <option value="Referral">Referral</option>
        </select>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-slate-900 dark:text-white">
          <option value="Latest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Lead Info</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Source</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Created</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600 dark:text-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-blue-500 mb-2" size={32} />
                    <p className="text-slate-500 dark:text-slate-400">Loading leads...</p>
                  </td>
                </tr>
              ) : data?.leads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <FilterX className="mx-auto text-slate-400 mb-3" size={40} />
                    <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">No leads found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              ) : (
                data?.leads.map((lead) => (
                  <tr key={lead._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">{lead.name}</div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">{lead.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">{lead.source}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => { setSelectedLead(lead); setIsDetailsOpen(true); }}
                        className="text-slate-400 hover:text-blue-500 transition-colors p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        onClick={() => { setSelectedLead(lead); setIsFormOpen(true); }}
                        className="text-slate-400 hover:text-green-500 transition-colors p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20"
                        title="Edit Lead"
                      >
                        <Edit size={18} />
                      </button>
                      {user?.role === 'Admin' && (
                        <button 
                          onClick={() => handleDelete(lead._id)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                          title="Delete Lead"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {data && data.pagination.pages > 1 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              Showing page {data.pagination.page} of {data.pagination.pages} ({data.pagination.total} total)
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
              >
                Previous
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
                disabled={page === data.pagination.pages}
                className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <LeadFormModal 
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedLead}
        isLoading={isSubmitting}
      />

      <LeadDetailsModal 
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        leadId={selectedLead?._id || null}
      />
    </div>
  );
};