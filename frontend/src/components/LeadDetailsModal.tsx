import { useState, useEffect } from 'react';
import { X, Loader2, Mail, Globe, Clock, Activity } from 'lucide-react';
import { Lead } from '../types/lead';
import api from '../services/api';

interface LeadDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string | null;
}

export const LeadDetailsModal = ({ isOpen, onClose, leadId }: LeadDetailsModalProps) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && leadId) {
      const fetchLead = async () => {
        setIsLoading(true);
        setError('');
        try {
          // Hits the GET /api/leads/:id endpoint
          const response = await api.get(`/leads/${leadId}`);
          setLead(response.data);
        } catch (err) {
          setError('Failed to load lead details.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchLead();
    }
  }, [isOpen, leadId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white">
          <X size={20} />
        </button>

        {isLoading ? (
          <div className="p-12 flex flex-col items-center">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
            <p className="text-slate-500 dark:text-slate-400">Loading details...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : lead ? (
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
              <div className="h-16 w-16 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-2xl font-bold">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{lead.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <Mail size={14} /> {lead.email}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Activity size={16} /> Status</div>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.status}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Globe size={16} /> Source</div>
                <span className="font-semibold text-slate-900 dark:text-white">{lead.source}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400"><Clock size={16} /> Created</div>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {new Date(lead.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};