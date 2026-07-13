import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, Text, View } from 'react-native';
import { Image as ImageIcon, Plus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { PortfolioItem, PortfolioItemData } from '@app-types/index';
import { artisanService } from '@services/artisan.service';
import { Button, Input, Modal } from '@shared/components';
import { colors } from '@shared/ui/colors';

interface DisplayPortfolioItem {
  id: string;
  imageUrl: string;
  caption: string;
  /** Whether this item has a real server-side id for delete operations */
  canDelete: boolean;
}

function toDisplayItem(item: PortfolioItem | PortfolioItemData): DisplayPortfolioItem {
  if ('title' in item) {
    return { id: item.id, imageUrl: item.imageUrl, caption: item.title, canDelete: true };
  }
  return { id: item.imageUrl, imageUrl: item.imageUrl, caption: item.caption, canDelete: false };
}

interface ProfilePortfolioProps {
  artisanId: string;
  items: (PortfolioItem | PortfolioItemData)[];
}

export const ProfilePortfolio: React.FC<ProfilePortfolioProps> = ({
  artisanId,
  items: externalItems,
}) => {
  const [items, setItems] = useState<DisplayPortfolioItem[]>(
    externalItems.map(toDisplayItem)
  );
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setItems(externalItems.map(toDisplayItem));
  }, [externalItems]);

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
        artisanId,
        pendingImage,
        title.trim(),
        description.trim() || undefined
      );
      setItems((prev) => [toDisplayItem(newItem), ...prev]);
      setPendingImage(null);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('[ProfilePortfolio] Portfolio upload failed', err);
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
        <View className="gap-4">
          {items.map((item) => (
            <View
              key={item.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm shadow-gray-200"
            >
              <View className="relative">
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-48 w-full bg-gray-100"
                  resizeMode="cover"
                />
                {item.canDelete && (
                  <Pressable
                    onPress={() => handleRemove(item.id)}
                    className="absolute right-2 top-2 h-8 w-8 items-center justify-center rounded-full bg-black/50 active:opacity-70"
                  >
                    <Trash2 size={15} color="#ffffff" />
                  </Pressable>
                )}
              </View>
              <View className="p-3">
                <Text className="text-base font-bold text-gray-900" numberOfLines={1}>
                  {item.caption}
                </Text>
              </View>
            </View>
          ))}
          <Pressable
            onPress={handleAdd}
            className="h-20 items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 active:opacity-70"
          >
            <Plus size={24} color={colors.gray400} />
          </Pressable>
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
