
import React from 'react';
import { Button } from '@/components/ui/button';
import { Proposal } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

interface ProposalListProps {
  proposals: Proposal[];
  onEdit: (proposal: Proposal) => void;
  onDelete: (id: string) => void;
}

const ProposalList: React.FC<ProposalListProps> = ({ proposals, onEdit, onDelete }) => {
  const { user } = useAuth();

  const getStatusColor = (status: string) => {
    const colors = {
      draft: '#6b7280',
      sent: '#3b82f6',
      accepted: '#10b981',
      rejected: '#ef4444',
      negotiating: '#fd8320',
    };
    return colors[status as keyof typeof colors] || '#6b7280';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const canEdit = (proposal: Proposal) => {
    return user?.role === 'admin' || proposal.createdBy === user?.id;
  };

  const canDelete = (proposal: Proposal) => {
    return user?.role === 'admin' || proposal.createdBy === user?.id;
  };

  const downloadPDF = (proposal: Proposal) => {
    console.log('Downloading PDF for proposal:', proposal.title);
    alert('PDF download functionality would be implemented here');
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Robot Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
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
            {proposals.map((proposal) => (
              <tr key={proposal.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{proposal.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {proposal.brand} {proposal.robot}
                  </div>
                  <div className="text-sm text-gray-500">
                    {proposal.controller} | {proposal.reach}mm | {proposal.payload}kg
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatCurrency(proposal.cost)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span 
                    className="inline-flex px-2 py-1 text-xs font-semibold rounded-full text-white capitalize"
                    style={{ backgroundColor: getStatusColor(proposal.status) }}
                  >
                    {proposal.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(proposal.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadPDF(proposal)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                  >
                    PDF
                  </Button>
                  {canEdit(proposal) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(proposal)}
                      className="text-[#fd8320] border-[#fd8320] hover:bg-[#fd8320] hover:text-white"
                    >
                      Edit
                    </Button>
                  )}
                  {canDelete(proposal) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this proposal?')) {
                          onDelete(proposal.id);
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

      {proposals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No proposals found.</p>
        </div>
      )}
    </div>
  );
};

export default ProposalList;
