import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Edit3, Plus, Package, Trash2 } from 'lucide-react-native';
import { Service } from '@app-types/index';
import { Button, Modal } from '@shared/components';
import { EmptyState } from '@shared/components';
import { ServiceForm, ServiceFormValues } from './ServiceForm';
import { artisanApi } from '@services/api/artisan.api';
import { artisanManageService } from '@services/artisan.manage.service';
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
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadServices = useCallback(() => {
    if (!artisanId) {
      console.warn('[ProfileServicesSection] No artisanId provided');
      return;
    }
    setIsLoading(true);
    artisanApi
      .getServices(artisanId)
      .then((result) => {
        setServices(result);
      })
      .catch((err) => {
        console.error('[ProfileServicesSection] Failed to load services', err);
        setServices([]);
      })
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
    } catch (err) {
      console.error('[ProfileServicesSection] Failed to create service', err);
      Alert.alert('Error', 'Failed to create service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (values: ServiceFormValues) => {
    if (!editingService) return;
    setIsSubmitting(true);
    try {
      await artisanManageService.updateService(artisanId, editingService.id, {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        durationMinutes: Number(values.durationMinutes),
        category: values.category,
      });
      setEditingService(null);
      setIsModalVisible(false);
      loadServices();
    } catch (err) {
      console.error('[ProfileServicesSection] Failed to update service', err);
      Alert.alert('Error', 'Failed to update service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (service: Service) => {
    Alert.alert('Delete Service', `Remove "${service.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await artisanManageService.deleteService(artisanId, service.id);
            setServices((prev) => prev.filter((s) => s.id !== service.id));
          } catch (err) {
            console.error('[ProfileServicesSection] Failed to delete service', err);
            Alert.alert('Error', 'Failed to delete service. Please try again.');
          }
        },
      },
    ]);
  };

  const openCreateModal = () => {
    setEditingService(null);
    setIsModalVisible(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setEditingService(null);
    setIsModalVisible(false);
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
          onPress={openCreateModal}
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
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-base font-bold text-gray-900">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500" numberOfLines={2}>
                    {item.description}
                  </Text>
                </View>
                <View className="ml-2 flex-row gap-1">
                  <Pressable
                    onPress={() => openEditModal(item)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                  >
                    <Edit3 size={14} color={colors.gray600} />
                  </Pressable>
                  <Pressable
                    onPress={() => handleDelete(item)}
                    className="h-8 w-8 items-center justify-center rounded-full bg-red-50"
                  >
                    <Trash2 size={14} color={colors.danger} />
                  </Pressable>
                </View>
              </View>
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
                    {(item as any).categoryName ?? ((item as any).category?.name ?? (item as any).category ?? '')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      <Modal
        visible={isModalVisible}
        onClose={closeModal}
        title={editingService ? 'Edit Service' : 'New Service'}
        placement="bottom"
      >
        <ServiceForm
          key={editingService?.id ?? 'create'}
          initialValues={
            editingService
              ? {
                  title: editingService.title,
                  description: editingService.description,
                  price: String(editingService.price),
                  durationMinutes: String(editingService.durationMinutes),
                  category: editingService.category,
                }
              : undefined
          }
          onSubmit={editingService ? handleUpdate : handleCreate}
          isSubmitting={isSubmitting}
          submitLabel={editingService ? 'Update Service' : 'Add Service'}
        />
      </Modal>
    </View>
  );
};
