import React, { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { Plus, Package } from 'lucide-react-native';
import { Service } from '@app-types/index';
import { Button, Modal } from '@shared/components';
import { EmptyState } from '@shared/components';
import { ServiceForm, ServiceFormValues } from './ServiceForm';
import { artisanApi } from '@services/api/artisan.api';
import { formatCurrency } from '@utils/currency';
import { colors } from '@shared/ui/colors';

interface ProfileServicesSectionProps {
  artisanId: string;
}

export const ProfileServicesSection: React.FC<ProfileServicesSectionProps> = ({
  artisanId,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServices = useCallback(() => {
    if (!artisanId) return;
    setIsLoading(true);
    artisanApi
      .getServices(artisanId)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false));
  }, [artisanId]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleCreate = async (values: ServiceFormValues) => {
    setIsSubmitting(true);
    try {
      await artisanApi.createService(artisanId, {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        durationMinutes: Number(values.durationMinutes),
        category: values.category,
      });
      setIsModalVisible(false);
      loadServices();
    } catch {
      Alert.alert('Failed to create service', 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="font-heading text-lg font-bold text-gray-900">
          Skills & Services
        </Text>
        <Button
          label="Add Service"
          size="sm"
          leftIcon={<Plus size={16} color="#ffffff" />}
          onPress={() => setIsModalVisible(true)}
        />
      </View>

      {isLoading ? (
        <View className="rounded-2xl bg-white p-6">
          <Text className="text-center text-sm text-gray-400">
            Loading services...
          </Text>
        </View>
      ) : services.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No services yet"
          description="Add a service so students can start booking you."
        />
      ) : (
        <View className="gap-3">
          {services.map((item) => (
            <View
              key={item.id}
              className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm shadow-gray-200"
            >
              <Text className="text-base font-bold text-gray-900">
                {item.title}
              </Text>
              <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                {item.description}
              </Text>
              <View className="mt-2 flex-row items-center">
                <Text className="text-sm font-semibold text-primary">
                  {formatCurrency(item.price)}
                </Text>
                <Text className="mx-1 text-sm text-gray-400">·</Text>
                <Text className="text-sm text-gray-500">
                  {item.durationMinutes} min
                </Text>
                <View className="ml-2 rounded-full bg-gray-100 px-2 py-0.5">
                  <Text className="text-[10px] font-medium text-gray-600 uppercase">
                    {item.category}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="New Service"
        placement="bottom"
      >
        <ServiceForm
          onSubmit={handleCreate}
          isSubmitting={isSubmitting}
          submitLabel="Add Service"
        />
      </Modal>
    </View>
  );
};
