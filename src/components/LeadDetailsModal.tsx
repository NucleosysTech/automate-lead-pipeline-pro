
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Lead, FollowUp, Memo } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface LeadDetailsModalProps {
  lead: Lead;
  onClose: () => void;
}

const LeadDetailsModal: React.FC<LeadDetailsModalProps> = ({ lead, onClose }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'memos'>('details');
  const [newFollowUp, setNewFollowUp] = useState({ content: '', type: 'note' as FollowUp['type'] });
  const [newMemo, setNewMemo] = useState({ content: '', category: 'project' as Memo['category'] });

  const addFollowUp = () => {
    if (!newFollowUp.content.trim()) return;

    // In a real app, this would update the lead in the backend
    console.log('Adding follow-up:', newFollowUp);
    setNewFollowUp({ content: '', type: 'note' });
    toast({
      title: "Follow-up added",
      description: "Follow-up has been recorded successfully.",
    });
  };

  const addMemo = () => {
    if (!newMemo.content.trim()) return;

    // In a real app, this would update the lead in the backend
    console.log('Adding memo:', newMemo);
    setNewMemo({ content: '', category: 'project' });
    toast({
      title: "Memo added",
      description: "Memo has been added successfully.",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Lead Details - {lead.companyName}</h2>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'details', label: 'Details' },
              { id: 'history', label: 'Follow-up History' },
              { id: 'memos', label: 'Memos' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-[#fd8320] text-[#fd8320]'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Company Name</Label>
                    <p className="text-gray-900">{lead.companyName}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Contact Person</Label>
                    <p className="text-gray-900">{lead.contactPerson}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-gray-900">{lead.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Phone</Label>
                    <p className="text-gray-900">{lead.phone}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Lead Information</h3>
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Application</Label>
                    <p className="text-gray-900">{lead.application}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <p className="text-gray-900">{lead.status}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Source</Label>
                    <p className="text-gray-900">{lead.source}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Created Date</Label>
                    <p className="text-gray-900">{new Date(lead.createdAt).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Add Follow-up</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="followUpContent">Follow-up Content</Label>
                    <Input
                      id="followUpContent"
                      value={newFollowUp.content}
                      onChange={(e) => setNewFollowUp({ ...newFollowUp, content: e.target.value })}
                      placeholder="Enter follow-up details..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="followUpType">Type</Label>
                    <Select 
                      value={newFollowUp.type} 
                      onValueChange={(value) => setNewFollowUp({ ...newFollowUp, type: value as FollowUp['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="note">Note</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addFollowUp} className="bg-[#fd8320] hover:bg-[#e6751d] text-white">
                  Add Follow-up
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Follow-up History</h3>
              <div className="space-y-3">
                {lead.followUps.length === 0 ? (
                  <p className="text-gray-500">No follow-ups recorded yet.</p>
                ) : (
                  lead.followUps.map((followUp) => (
                    <div key={followUp.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{followUp.content}</p>
                          <p className="text-sm text-gray-500">
                            Type: {followUp.type} | {new Date(followUp.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'memos' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Add Memo</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="memoContent">Memo Content</Label>
                    <Input
                      id="memoContent"
                      value={newMemo.content}
                      onChange={(e) => setNewMemo({ ...newMemo, content: e.target.value })}
                      placeholder="Enter memo details..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="memoCategory">Category</Label>
                    <Select 
                      value={newMemo.category} 
                      onValueChange={(value) => setNewMemo({ ...newMemo, category: value as Memo['category'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spare">Spare</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                        <SelectItem value="service_provided">Service Provided</SelectItem>
                        <SelectItem value="key_account">Key Account</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={addMemo} className="bg-[#fd8320] hover:bg-[#e6751d] text-white">
                  Add Memo
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Memos</h3>
              <div className="space-y-3">
                {lead.memos.length === 0 ? (
                  <p className="text-gray-500">No memos added yet.</p>
                ) : (
                  lead.memos.map((memo) => (
                    <div key={memo.id} className="border rounded p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{memo.content}</p>
                          <p className="text-sm text-gray-500">
                            Category: {memo.category} | {new Date(memo.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadDetailsModal;
