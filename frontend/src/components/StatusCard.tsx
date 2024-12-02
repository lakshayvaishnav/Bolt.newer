import React from 'react';
import { CheckCircle, Circle, XCircle } from 'lucide-react';
import { BuildStatus } from '../types';
import { Loader } from './Loader';

interface StatusCardProps {
  status: BuildStatus;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status }) => {
  const getIcon = () => {
    switch (status.status) {
      case 'building':
        return <Loader />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Circle className="w-6 h-6 text-notion-dimmed" />;
    }
  };

  return (
    <div className="bg-notion-default rounded-lg p-4 mb-4">
      <div className="flex items-center space-x-3">
        {getIcon()}
        <div>
          <h3 className="font-medium capitalize text-notion-text">{status.status}</h3>
          {status.message && <p className="text-sm text-notion-dimmed">{status.message}</p>}
        </div>
      </div>
    </div>
  );
};