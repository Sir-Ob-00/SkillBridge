import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Text, View } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plus, Package } from 'lucide-react-native';
import { ArtisanTabParamList, ArtisanStackParamList } from '../artisan.types';
import { ScreenWrapper } from '@shared/layout';
import { Button, Modal } from '@shared/components';
import { EmptyState } from '@shared/components';
import { Loader } from '@shared/components/Loader';
import { ServiceForm, ServiceFormValues } from '../components/ServiceForm';
import { artisanApi } from '@services/api/artisan.api';
import { Service } from '@types/index';
import { useAuthStore } from '@store/auth.store';
import { formatCurrency } from '@utils/currency';

type Props = CompositeScreenProps<
  BottomTabScreenProps<ArtisanTabParamList, 'Services'>,
  NativeStackScreenProps<ArtisanStackParamList>
>;

export const ServiceManagementScreen: React.FC<Props> = () => {
  const artisanId = useAuthStore((state) => state.user?.id ?? '');
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServices = () => {
    if (!artisanId) return;
    setIsLoading(true);
    artisanApi
      .getServices(artisanId)
      .then(setServices)
      .catch(() => setServices([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadServices();
  }, [artisanId]);

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
    <ScreenWrapper scrollable={false} contentClassName="pt-2">
      <View className="mb-6 flex-row items-center justify-between">
        <Text className="font-heading text-3xl font-bold text-gray-900">
          My Services
        </Text>
        <Button
          label="Add"
          size="sm"
          leftIcon={<Plus size={16} color="#ffffff" />}
          onPress={() => setIsModalVisible(true)}
        />
      </View>

      {isLoading ? (
        <Loader label="Loading services..." />
      ) : services.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No services yet"
          description="Add a service so students can start booking you."
          actionLabel="Add Service"
          onAction={() => setIsModalVisible(true)}
        />
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <View className="mb-4 rounded-3xl border border-transparent bg-white p-5 shadow-sm shadow-gray-200">
              <Text className="text-lg font-bold text-gray-900">
                {item.title}
              </Text>
              <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                {item.description}
              </Text>
              <Text className="mt-2 text-sm font-medium text-primary">
                {formatCurrency(item.price)} · {item.durationMinutes} min
              </Text>
            </View>
          )}
        />
      )}

      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="New Service"
        placement="bottom"
      >
        <ServiceForm onSubmit={handleCreate} isSubmitting={isSubmitting} submitLabel="Add Service" />
      </Modal>
    </ScreenWrapper>
  );
};
