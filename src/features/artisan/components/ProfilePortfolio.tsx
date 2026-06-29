import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { PortfolioItem } from '@app-types/index';
import { artisanService } from '@services/artisan.service';
import { Button, Input, Modal } from '@shared/components';
import { colors } from '@shared/ui/colors';

interface ProfilePortfolioProps {
  artisanId: string;
}

export const ProfilePortfolio: React.FC<ProfilePortfolioProps> = ({
  artisanId,
}) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    artisanService
      .getPortfolio(artisanId)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [artisanId]);

  const handleAdd = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission Required',
        'Allow access to your photo library to add portfolio images.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (result.canceled || !result.assets[0]) return;

    setPendingImage(result.assets[0].uri);
    setTitle('');
    setDescription('');
  };

  const handleUpload = async () => {
    if (!pendingImage || !title.trim()) return;
    setUploading(true);
    try {
      const newItem = await artisanService.addPortfolioItem(
        pendingImage,
        title.trim(),
        description.trim() || undefined
      );
      setItems((prev) => [newItem, ...prev]);
      setPendingImage(null);
      setTitle('');
      setDescription('');
    } catch {
      Alert.alert('Failed', 'Could not upload portfolio image.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (itemId: string) => {
    Alert.alert('Remove', 'Remove this portfolio item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await artisanService.removePortfolioItem(artisanId, itemId);
            setItems((prev) => prev.filter((i) => i.id !== itemId));
          } catch {
            Alert.alert('Failed', 'Could not remove item.');
          }
        },
      },
    ]);
  };

  if (loading) return null;

  return (
    <View className="mb-6">
      <Text className="mb-3 font-heading text-lg font-bold text-gray-900">
        Portfolio
      </Text>

      {items.length === 0 ? (
        <View className="items-center rounded-2xl border border-dashed border-gray-300 bg-white p-8">
          <View className="mb-3 h-14 w-14 items-center justify-center rounded-full bg-gray-100">
            <ImageIcon size={28} color={colors.gray400} />
          </View>
          <Text className="mb-1 text-base font-semibold text-gray-900">
            No portfolio items yet
          </Text>
          <Text className="mb-4 text-center text-sm text-gray-500">
            Showcase your best work to attract more clients.
          </Text>
          <Pressable
            onPress={handleAdd}
            className="flex-row items-center rounded-xl bg-primary px-5 py-2.5 active:opacity-80"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="ml-1.5 text-sm font-semibold text-white">
              Add Photo
            </Text>
          </Pressable>
        </View>
      ) : (
        <View>
          <View className="mb-3 flex-row flex-wrap gap-3">
            {items.map((item) => (
              <View key={item.id} className="relative w-[calc(33.33%-8px)]">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-28 w-full rounded-xl bg-gray-100"
                  resizeMode="cover"
                />
                <Pressable
                  onPress={() => handleRemove(item.id)}
                  className="absolute right-1.5 top-1.5 h-7 w-7 items-center justify-center rounded-full bg-black/50 active:opacity-70"
                >
                  <Trash2 size={14} color="#ffffff" />
                </Pressable>
              </View>
            ))}
            <Pressable
              onPress={handleAdd}
              className="h-28 w-[calc(33.33%-8px)] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 active:opacity-70"
            >
              <Plus size={24} color={colors.gray400} />
            </Pressable>
          </View>
        </View>
      )}

      <Modal
        visible={!!pendingImage}
        onClose={() => setPendingImage(null)}
        title="Add Portfolio Item"
      >
        {pendingImage && (
          <View>
            <Image
              source={{ uri: pendingImage }}
              className="mb-4 h-48 w-full rounded-xl bg-gray-100"
              resizeMode="cover"
            />
            <Input
              placeholder="Title"
              value={title}
              onChangeText={setTitle}
              className="mb-3"
            />
            <Input
              placeholder="Description (optional)"
              value={description}
              onChangeText={setDescription}
              className="mb-4"
            />
            <View className="w-full flex-row gap-3">
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setPendingImage(null)}
                className="flex-1"
              />
              <Button
                label={uploading ? 'Uploading...' : 'Upload'}
                variant="primary"
                onPress={handleUpload}
                disabled={uploading || !title.trim()}
                className="flex-1"
              />
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
};
