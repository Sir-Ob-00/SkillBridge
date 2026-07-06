import React from 'react';
import { ReportForm } from '@features/reports/components/ReportForm';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  targetUserId: string;
  onSuccess?: () => void;
}

const ReportModal: React.FC<ReportModalProps> = (props) => <ReportForm {...props} />;

export default React.memo(ReportModal);
