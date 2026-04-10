'use client';

import { motion } from 'framer-motion';
import { Play, Download, Share2, User, Clock } from 'lucide-react';
import { Button } from '@/components/form/CustomButton';
import { Badge } from '@/components/form/Badge';
import { CallRecording } from '../../types/callRecording';

interface RecordingTableRowProps {
  recording: CallRecording;
  index: number;
  onPlay: (recording: CallRecording) => void;
  onDownload: (id: string) => void;
  onShare: (recording: CallRecording) => void;
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    Available: 'bg-green-100 text-green-800 border-green-200',
    Processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Transcribing: 'bg-blue-100 text-blue-800 border-blue-200',
    Archived: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const getQualityColor = (quality: string) => {
  const colors: Record<string, string> = {
    HD: 'bg-purple-100 text-purple-800 border-purple-200',
    Standard: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[quality] || 'bg-gray-100 text-gray-800 border-gray-200';
};

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const RecordingTableRow = ({ recording, index, onPlay, onDownload, onShare }: RecordingTableRowProps) => {
  const isAvailable = recording.status === 'Available';

  return (
    <motion.tr
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * index }}
      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
    >
      <td className="py-3 px-4 font-medium text-gray-900">{recording.recordingId}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          <span className="text-gray-700">{recording.customer.name}</span>
        </div>
      </td>
      <td className="py-3 px-4 text-gray-600 text-sm">{formatDate(recording.callDate)}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm font-mono">
          <Clock className="h-4 w-4 text-gray-400" />
          {formatDuration(recording.duration)}
        </div>
      </td>
      <td className="py-3 px-4 text-gray-700">{recording.agent.name}</td>
      <td className="py-3 px-4 text-gray-700 max-w-xs truncate">{recording.topic}</td>
      <td className="py-3 px-4">
        <Badge className={`${getQualityColor(recording.quality)} border`}>
          {recording.quality}
        </Badge>
      </td>
      <td className="py-3 px-4 text-gray-600 text-sm">{recording.fileSize}</td>
      <td className="py-3 px-4">
        <Badge className={`${getStatusColor(recording.status)} border`}>
          {recording.status}
        </Badge>
      </td>
      <td className="py-3 px-4">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-green-50"
            disabled={!isAvailable}
            onClick={() => onPlay(recording)}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-blue-50"
            disabled={!isAvailable}
            onClick={() => onDownload(recording._id)}
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="hover:bg-purple-50"
            disabled={!isAvailable}
            onClick={() => onShare(recording)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </td>
    </motion.tr>
  );
};