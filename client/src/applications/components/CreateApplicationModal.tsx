import { Button } from '@client/common/components/button';
import { Input } from '@client/common/components/input';
import { Selector } from '@client/common/components/select/Selector';
import { Toast } from '@client/common/components/toast';
import { useCoverLetters, useResumes } from '@client/resources/resumes/hooks';
import { useAuth } from '@client/shared/hooks';
import { H4 } from '@common/components/typography';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useCreateApplication } from '../hooks/applicationHooks';

interface CreateApplicationFormData {
  employer: string;
  jobTitle: string;
  jobUrl?: string;
  salaryRange?: string;
  contact?: string;
  location: string;
  platform: 'linkedin' | 'glassdoor' | 'other';
  status: 'applied' | 'interviewing' | 'accepted' | 'rejected';
  resumeId?: string;
  coverletterId?: string;
}

const platformItems = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'glassdoor', label: 'Glassdoor' },
  { value: 'other', label: 'Other' },
];

const statusItems = [
  { value: 'applied', label: 'Applied' },
  { value: 'interviewing', label: 'Interviewing' },
  { value: 'accepted', label: 'Accepted' },
  { value: 'rejected', label: 'Rejected' },
];

interface CreateApplicationCardProps {
  onClose: () => void;
}

export const CreateApplicationModal = ({
  onClose,
}: CreateApplicationCardProps) => {
  const [formData, setFormData] = useState<CreateApplicationFormData>({
    employer: '',
    jobTitle: '',
    jobUrl: '',
    salaryRange: '',
    contact: '',
    location: '',
    platform: 'other',
    status: 'applied',
    resumeId: undefined,
    coverletterId: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { mutateAsync: createApplication } = useCreateApplication();
  const { data: user } = useAuth();
  const { data: resumes } = useResumes(user?.id || '');
  const { data: coverLetters } = useCoverLetters(user?.id || '');

  const resumeItems = [
    { value: 'none', label: 'None' },
    ...(resumes?.map((r) => ({ value: r.id, label: r.name })) || []),
  ];

  const coverLetterItems = [
    { value: 'none', label: 'None' },
    ...(coverLetters?.map((cl) => ({ value: cl.id, label: cl.name })) || []),
  ];

  const handleInputChange = (
    field: keyof CreateApplicationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.employer || !formData.jobTitle || !formData.location) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await createApplication({
        userId: user?.id || '',
        data: formData,
      });
      if (!res.success || res.isForbidden || res.isUnauthorized) {
        Toast.error({
          description: 'Error creating application.Try again later',
        });
      }
      if (res.success) {
        Toast.success({ description: 'Application created successfully' });
      }
      onClose();
    } catch (error) {
      console.error('Failed to create application:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };
  return (
    <div className="bg-background rounded-lg p-8 shadow-sm border border-border">
      <div className="mb-6 flex items-center justify-between">
        <H4>Create New Application</H4>
        <Button variant="light" isIconOnly onPress={handleCancel}>
          <XMarkIcon className="size-5" />
        </Button>
      </div>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Company Name"
            placeholder="Enter company name"
            value={formData.employer}
            onValueChange={(value) => handleInputChange('employer', value)}
            isRequired
          />
          <Input
            label="Job Title"
            placeholder="Enter job title"
            value={formData.jobTitle}
            onValueChange={(value) => handleInputChange('jobTitle', value)}
            isRequired
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location"
            placeholder="Enter job location"
            value={formData.location}
            onValueChange={(value) => handleInputChange('location', value)}
            isRequired
          />
          <Input
            label="Salary Range"
            placeholder="e.g. $80,000 - $100,000"
            value={formData.salaryRange}
            onValueChange={(value) => handleInputChange('salaryRange', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Job URL"
            placeholder="Link to job posting"
            value={formData.jobUrl}
            onValueChange={(value) => handleInputChange('jobUrl', value)}
          />
          <Input
            label="Contact Person"
            placeholder="Recruiter or hiring manager"
            value={formData.contact}
            onValueChange={(value) => handleInputChange('contact', value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Platform"
            placeholder="Where did you find this job?"
            selectedKeys={[formData.platform]}
            onSelectionChange={(value) => handleInputChange('platform', value)}
            items={platformItems}
          />

          <Selector
            label="Status"
            placeholder="Current application status"
            selectedKeys={[formData.status]}
            onSelectionChange={(value) => handleInputChange('status', value)}
            items={statusItems}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Selector
            label="Attach Resume"
            placeholder="Select a resume"
            selectedKeys={formData.resumeId ? [formData.resumeId] : []}
            onSelectionChange={(value) => handleInputChange('resumeId', value)}
            items={resumeItems}
          />

          <Selector
            label="Attach Cover Letter"
            placeholder="Select a cover letter"
            selectedKeys={
              formData.coverletterId ? [formData.coverletterId] : []
            }
            onSelectionChange={(value) =>
              handleInputChange('coverletterId', value)
            }
            items={coverLetterItems}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-8">
        <Button variant="light" onPress={handleCancel}>
          Cancel
        </Button>
        <Button
          color="primary"
          onPress={handleSubmit}
          isLoading={isLoading}
          isDisabled={
            !formData.employer || !formData.jobTitle || !formData.location
          }
        >
          Create Application
        </Button>
      </div>
    </div>
  );
};
