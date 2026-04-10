'use client';

import { motion } from 'framer-motion';
import { Mic } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/form/Card';
import { CallRecording } from '../../types/callRecording';
import { RecordingTableRow } from './RecordingTableRow';

interface RecordingsTableProps {
  recordings: CallRecording[];
  onPlay: (recording: CallRecording) => void;
  onDownload: (id: string) => void;
  onShare: (recording: CallRecording) => void;
}

export const RecordingsTable = ({ recordings, onPlay, onDownload, onShare }: RecordingsTableProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-0 shadow-xl bg-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500">
              <Mic className="h-5 w-5 text-white" />
            </div>
            Call Recordings ({recordings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Recording ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Call Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Duration</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Agent</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Topic</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Quality</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Size</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recordings.map((recording, index) => (
                  <RecordingTableRow
                    key={recording._id}
                    recording={recording}
                    index={index}
                    onPlay={onPlay}
                    onDownload={onDownload}
                    onShare={onShare}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};