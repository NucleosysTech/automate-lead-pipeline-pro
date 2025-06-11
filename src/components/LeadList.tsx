
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Lead, LEAD_STATUSES } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import LeadDetailsModal from './LeadDetailsModal';

interface LeadListProps {
  leads: Lead[];
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onEdit, onDelete }) => {
  const { user } = useAuth();
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const getStatusColor = (status: string) => {
    const statusConfig = LEAD_STATUSES.find(s => s.value === status);
    return statusConfig?.color || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const canEdit = (lead: Lead) => {
    return user?.role === 'admin' || lead.assignedTo === user?.id || lead.createdBy === user?.id;
  };

  const canDelete = (lead: Lead) => {
    return user?.role === 'admin' || lead.createdBy === user?.id;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.companyName}</div>
                    <div className="text-sm text-gray-500">{lead.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{lead.contactPerson}</div>
                    <div className="text-sm text-gray-500">{lead.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {lead.application}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white"
                    style={{ backgroundColor: getStatusColor(lead.status) }}
                  >
                    {LEAD_STATUSES.find(s => s.value === lead.status)?.label || lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(lead.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLead(lead)}
                    className="text-[#fd8320] border-[#fd8320] hover:bg-[#fd8320] hover:text-white"
                  >
                    View
                  </Button>
                  {canEdit(lead) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(lead)}
                    >
                      Edit
                    </Button>
                  )}
                  {canDelete(lead) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this lead?')) {
                          onDelete(lead.id);
                        }
                      }}
                      className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leads.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No leads found.</p>
        </div>
      )}

      {selectedLead && (
        <LeadDetailsModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </div>
  );
};

export default LeadList;
