
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProposalTemplate } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ProposalTemplateMaster: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProposalTemplate | null>(null);
  const { toast } = useToast();

  const [templates, setTemplates] = useState<ProposalTemplate[]>([
    {
      id: '1',
      name: 'Standard Robotic System Template',
      headerContent: 'Mahajan Automation (Pune)\nAddress: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115\ninfo@mahajanautomation.com\n+91 84848 79901 (India)',
      footerContent: 'Mahajan Automation (Pune)\nAddress: Gate No. 441, S.No. 474/1 Lawasa road, Near primary school, Mukaiwadi, Tal.Mulshi Poud Rd, Pirangut, Maharashtra 412115\ninfo@mahajanautomation.com\n+91 84848 79901 (India)',
      logoUrl: 'https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png',
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    headerContent: '',
    footerContent: '',
    logoUrl: 'https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      setTemplates(templates.map(template => 
        template.id === editingTemplate.id 
          ? { 
              ...template, 
              ...formData, 
              updatedAt: new Date().toISOString() 
            }
          : template
      ));
      toast({
        title: "Template updated",
        description: "Proposal template has been successfully updated.",
      });
    } else {
      const newTemplate: ProposalTemplate = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTemplates([...templates, newTemplate]);
      toast({
        title: "Template created",
        description: "New proposal template has been successfully created.",
      });
    }

    setFormData({
      name: '',
      headerContent: '',
      footerContent: '',
      logoUrl: 'https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png',
      isDefault: false,
    });
    setShowForm(false);
    setEditingTemplate(null);
  };

  const handleEdit = (template: ProposalTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      headerContent: template.headerContent,
      footerContent: template.footerContent,
      logoUrl: template.logoUrl,
      isDefault: template.isDefault,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setTemplates(templates.filter(template => template.id !== id));
      toast({
        title: "Template deleted",
        description: "Proposal template has been successfully deleted.",
      });
    }
  };

  const setAsDefault = (id: string) => {
    setTemplates(templates.map(template => ({
      ...template,
      isDefault: template.id === id
    })));
    toast({
      title: "Default template set",
      description: "Template has been set as default.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Proposal Template Master</h1>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
          >
            Add New Template
          </Button>
        </div>

        {/* Template List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{template.name}</h3>
                {template.isDefault && (
                  <span className="bg-[#fd8320] text-white text-xs px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Header:</label>
                  <p className="text-gray-600 text-xs mt-1 truncate">
                    {template.headerContent.substring(0, 100)}...
                  </p>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Footer:</label>
                  <p className="text-gray-600 text-xs mt-1 truncate">
                    {template.footerContent.substring(0, 100)}...
                  </p>
                </div>
                
                <div>
                  <label className="font-medium text-gray-700">Logo:</label>
                  <img 
                    src={template.logoUrl} 
                    alt="Logo" 
                    className="h-6 mt-1"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(template)}
                    className="text-[#fd8320] border-[#fd8320] hover:bg-[#fd8320] hover:text-white"
                  >
                    Edit
                  </Button>
                  {!template.isDefault && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAsDefault(template.id)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        Set Default
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Template Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingTemplate ? 'Edit Template' : 'Add New Template'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <Label htmlFor="logoUrl">Logo URL *</Label>
                  <Input
                    id="logoUrl"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    required
                    placeholder="Enter logo URL"
                  />
                </div>

                <div>
                  <Label htmlFor="headerContent">Header Content *</Label>
                  <textarea
                    id="headerContent"
                    value={formData.headerContent}
                    onChange={(e) => setFormData({ ...formData, headerContent: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fd8320] focus:border-transparent"
                    placeholder="Enter header content..."
                  />
                </div>

                <div>
                  <Label htmlFor="footerContent">Footer Content *</Label>
                  <textarea
                    id="footerContent"
                    value={formData.footerContent}
                    onChange={(e) => setFormData({ ...formData, footerContent: e.target.value })}
                    required
                    rows={5}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#fd8320] focus:border-transparent"
                    placeholder="Enter footer content..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isDefault">Set as default template</Label>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowForm(false);
                      setEditingTemplate(null);
                      setFormData({
                        name: '',
                        headerContent: '',
                        footerContent: '',
                        logoUrl: 'https://mahajanautomation.com/wp-content/uploads/2023/03/logo-1-284x18.png',
                        isDefault: false,
                      });
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-[#fd8320] hover:bg-[#e6751d] text-white"
                  >
                    {editingTemplate ? 'Update' : 'Create'} Template
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProposalTemplateMaster;
