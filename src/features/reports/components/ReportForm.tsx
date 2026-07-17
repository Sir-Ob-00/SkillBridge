import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { Modal, Button } from '@shared/components';
import { colors } from '@shared/ui/colors';
import { reportApi } from '@services/api/report.api';

interface ReportFormProps {
  visible: boolean;
  onClose: () => void;
  targetUserId: string;
  onSuccess?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({
  visible,
  onClose,
  targetUserId,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const trimmedReason = reason.trim();
    if (trimmedReason.length < 3) {
      setError('Reason must be at least 3 characters.');
      return;
    }
    if (trimmedReason.length > 120) {
      setError('Reason must be under 120 characters.');
      return;
    }

    const trimmedDetails = details.trim();
    if (trimmedDetails.length > 1000) {
      setError('Details must be under 1000 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await reportApi.create({
        targetUserId,
        reason: trimmedReason,
        ...(trimmedDetails ? { details: trimmedDetails } : {}),
      });
      setReason('');
      setDetails('');
      onClose();
      onSuccess?.();
      Alert.alert('Report Submitted', 'Thank you. Our team will review your report.');
    } catch (err) {
      const msg =
        (err as { message?: string })?.message || 'Failed to submit report.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    setReason('');
    setDetails('');
    setError('');
    onClose();
  };

  return (
    <Modal visible={visible} onClose={handleClose} title="Report User" placement="bottom">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="gap-4"
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center gap-2 rounded-xl bg-red-50 px-3 py-2">
            <AlertTriangle size={16} color={colors.danger} />
            <Text className="flex-1 text-xs text-red-700">
              Your report will be reviewed by our team. False reports may result in
              account suspension.
            </Text>
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700">
              Reason *
            </Text>
            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Brief reason (3-120 characters)"
              placeholderTextColor={colors.gray400}
              className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
              maxLength={120}
              textAlignVertical="top"
            />
            <Text className="mt-1 text-xs text-gray-400">
              {reason.length}/120
            </Text>
          </View>

          <View>
            <Text className="mb-1.5 text-sm font-medium text-gray-700">
              Details (optional)
            </Text>
            <TextInput
              value={details}
              onChangeText={setDetails}
              placeholder="Additional context (max 1000 characters)"
              placeholderTextColor={colors.gray400}
              multiline
              numberOfLines={4}
              className="min-h-[100px] rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-base text-gray-900"
              maxLength={1000}
              textAlignVertical="top"
            />
            <Text className="mt-1 text-xs text-gray-400">
              {details.length}/1000
            </Text>
          </View>

          {error ? (
            <Text className="text-sm text-red-600">{error}</Text>
          ) : null}

          <View className="flex-row gap-3 pb-4">
            <Button
              label="Cancel"
              variant="ghost"
              onPress={handleClose}
              className="flex-1"
              disabled={isSubmitting}
            />
            <Button
              label="Submit Report"
              variant="danger"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              className="flex-1"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
