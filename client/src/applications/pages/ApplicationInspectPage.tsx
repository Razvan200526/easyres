import {
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { Chip, ScrollShadow, Spinner } from '@heroui/react';
import { Icon } from '@iconify/react';
import { Button } from '@shared/components/button';
import { ErrorFallback } from '@shared/components/ErrorFallback';
import { H3, H4, H6 } from '@shared/components/typography';
import { useNavigate, useParams } from 'react-router';

import { useGetApplication } from '../hooks/applicationHooks';

const statusConfig = {
  applied: {
    color: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    label: 'Applied',
    icon: 'heroicons:document-text',
  },
  interviewing: {
    color: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
    label: 'Interviewing',
    icon: 'heroicons:chat-bubble-left-right',
  },
  accepted: {
    color: 'bg-green-500/10 text-green-700 border-green-500/20',
    label: 'Accepted',
    icon: 'heroicons:check-circle',
  },
  rejected: {
    color: 'bg-red-500/10 text-red-700 border-red-500/20',
    label: 'Rejected',
    icon: 'heroicons:x-circle',
  },
};

const platformConfig = {
  linkedin: {
    icon: 'mdi:linkedin',
    color: 'text-[#0077B5]',
    label: 'LinkedIn',
  },
  glassdoor: {
    icon: 'simple-icons:glassdoor',
    color: 'text-[#0CAA41]',
    label: 'Glassdoor',
  },
  other: {
    icon: 'heroicons:briefcase',
    color: 'text-primary',
    label: 'Other',
  },
};

export const ApplicationInspectPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: application,
    isError,
    isFetching,
  } = useGetApplication(id || '');

  if (isFetching || !application) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded flex items-center justify-center">
        <ErrorFallback error={new Error('Could not fetch application')} />
      </div>
    );
  }

  const statusInfo =
    statusConfig[application.status as keyof typeof statusConfig];
  const platformInfo =
    platformConfig[application.platform as keyof typeof platformConfig];

  return (
    <div className="bg-background m-4 h-[calc(100dvh-7rem)] border border-border rounded">
      <ScrollShadow className="h-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="light"
                isIconOnly
                onPress={() => navigate('/home/applications')}
              >
                <ArrowLeftIcon className="size-5" />
              </Button>
              <div>
                <H3 className="text-primary font-bold">
                  {application.jobTitle}
                </H3>
                <H6 className="text-muted">{application.employer}</H6>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="light"
                size="sm"
                startContent={<PencilIcon className="size-4" />}
              >
                Edit
              </Button>
              <Button
                variant="light"
                size="sm"
                color="danger"
                startContent={<TrashIcon className="size-4" />}
              >
                Delete
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Status & Platform */}
              <div className="bg-light border border-border rounded-lg p-4">
                <H4 className="mb-4">Status & Details</H4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={statusInfo.icon}
                        className="size-5 text-primary"
                      />
                      <span className="text-sm font-medium">Status:</span>
                    </div>
                    <Chip
                      size="sm"
                      className={`${statusInfo.color} border font-semibold`}
                    >
                      {statusInfo.label}
                    </Chip>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Icon
                        icon={platformInfo.icon}
                        className={`size-5 ${platformInfo.color}`}
                      />
                      <span className="text-sm font-medium">Platform:</span>
                    </div>
                    <span className="text-sm text-secondary-text">
                      {platformInfo.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* Job Information */}
              <div className="bg-light border border-border rounded-lg p-4">
                <H4 className="mb-4">Job Information</H4>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-1">
                        Company
                      </H6>
                      <p className="text-primary font-medium">
                        {application.employer}
                      </p>
                    </div>
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-1">
                        Position
                      </H6>
                      <p className="text-primary font-medium">
                        {application.jobTitle}
                      </p>
                    </div>
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-1">
                        Location
                      </H6>
                      <p className="text-secondary-text">
                        {application.location}
                      </p>
                    </div>
                    {application.salaryRange && (
                      <div>
                        <H6 className="text-sm font-semibold text-muted mb-1">
                          Salary Range
                        </H6>
                        <p className="text-secondary-text">
                          {application.salaryRange}
                        </p>
                      </div>
                    )}
                  </div>

                  {application.jobUrl && (
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-1">
                        Job Posting
                      </H6>
                      <a
                        href={application.jobUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <Icon icon="heroicons:link" className="size-4" />
                        View Original Posting
                      </a>
                    </div>
                  )}

                  {application.contact && (
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-1">
                        Contact Person
                      </H6>
                      <p className="text-secondary-text">
                        {application.contact}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comments & Suggestions */}
              {(application.comments?.length > 0 ||
                application.suggestions?.length > 0) && (
                <div className="bg-light border border-border rounded-lg p-4">
                  <H4 className="mb-4">Notes & Suggestions</H4>

                  {application.comments?.length > 0 && (
                    <div className="mb-4">
                      <H6 className="text-sm font-semibold text-muted mb-2">
                        Comments
                      </H6>
                      <ul className="space-y-2">
                        {application.comments.map((comment, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Icon
                              icon="heroicons:chat-bubble-left"
                              className="size-4 text-primary mt-0.5 shrink-0"
                            />
                            <span className="text-sm text-secondary-text">
                              {comment}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {application.suggestions?.length > 0 && (
                    <div>
                      <H6 className="text-sm font-semibold text-muted mb-2">
                        Suggestions
                      </H6>
                      <ul className="space-y-2">
                        {application.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <Icon
                              icon="heroicons:light-bulb"
                              className="size-4 text-amber-500 mt-0.5 shrink-0"
                            />
                            <span className="text-sm text-secondary-text">
                              {suggestion}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-light border border-border rounded-lg p-4">
                <H4 className="mb-4">Quick Info</H4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Applied</span>
                    <span className="text-sm font-medium">
                      {new Date(application.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Last Updated</span>
                    <span className="text-sm font-medium">
                      {new Date(application.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Status</span>
                    <Chip
                      size="sm"
                      className={`${statusInfo.color} border font-semibold`}
                    >
                      {statusInfo.label}
                    </Chip>
                  </div>
                </div>
              </div>

              {/* Related Documents */}
              {(application.resume || application.coverletter) && (
                <div className="bg-light border border-border rounded-lg p-4">
                  <H4 className="mb-4">Attached Documents</H4>
                  <div className="space-y-3">
                    {application.resume && (
                      <div className="flex items-center gap-3 p-2 border border-border rounded">
                        <Icon
                          icon="heroicons:document-text"
                          className="size-5 text-blue-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Resume</p>
                          <p className="text-xs text-muted">
                            {application.resume.name}
                          </p>
                        </div>
                        <Button variant="light" size="sm">
                          <Icon icon="heroicons:eye" className="size-4" />
                        </Button>
                      </div>
                    )}
                    {application.coverletter && (
                      <div className="flex items-center gap-3 p-2 border border-border rounded">
                        <Icon
                          icon="heroicons:document-text"
                          className="size-5 text-green-600"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Cover Letter</p>
                          <p className="text-xs text-muted">
                            {application.coverletter.name}
                          </p>
                        </div>
                        <Button variant="light" size="sm">
                          <Icon icon="heroicons:eye" className="size-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Timeline */}
              <div className="bg-light border border-border rounded-lg p-4">
                <H4 className="mb-4">Timeline</H4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Application Created</p>
                      <p className="text-xs text-muted">
                        {new Date(application.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        Status: {statusInfo.label}
                      </p>
                      <p className="text-xs text-muted">
                        {new Date(application.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollShadow>
    </div>
  );
};
