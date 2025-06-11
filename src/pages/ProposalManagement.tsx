
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Proposal } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ProposalForm from '@/components/ProposalForm';
import ProposalList from '@/components/ProposalList';

const ProposalManagement: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Proposal | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      leadId: '1',
      templateId: '1',
      title: 'Material Handling System Proposal',
      robot: 'R-2000iA/100P',
      controller: 'RJ3iB',
      reach: '3500',
      payload: '100',
      brand: 'Fanuc',
      cost: 251000,
      status: 'draft',
      attachments: [],
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    }
  ]);

  const handleCreateProposal = (proposalData: Partial<Proposal>) => {
    const newProposal: Proposal = {
      id: Date.now().toString(),
      ...proposalData,
      attachments: [],
      history: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: user?.id || '',
    } as Proposal;

    setProposals([...proposals, newProposal]);
    setShowForm(false);
    toast({
      title: "Proposal created",
      description: "New proposal has been successfully created.",
    });
  };

  const handleUpdateProposal = (proposalData: Partial<Proposal>) => {
    setProposals(proposals.map(proposal => 
      proposal.id === editingProposal?.id 
        ? { ...proposal, ...proposalData, updatedAt: new Date().toISOString() }
        : proposal
    ));
    setEditingProposal(null);
    setShowForm(false);
    toast({
      title: "Proposal updated",
      description: "Proposal has been successfully updated.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Proposal Management</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
          >
            Create New Proposal
          </Button>
        </div>

        <ProposalList 
          proposals={proposals}
          onEdit={(proposal) => {
            setEditingProposal(proposal);
            setShowForm(true);
          }}
          onDelete={(id) => {
            setProposals(proposals.filter(proposal => proposal.id !== id));
            toast({
              title: "Proposal deleted",
              description: "Proposal has been successfully deleted.",
            });
          }}
        />

        {showForm && (
          <ProposalForm
            proposal={editingProposal}
            onSave={editingProposal ? handleUpdateProposal : handleCreateProposal}
            onCancel={() => {
              setShowForm(false);
              setEditingProposal(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
};

export default ProposalManagement;
