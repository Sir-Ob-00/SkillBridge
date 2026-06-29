import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Button, Input } from '@shared/components';
import { CATEGORIES } from '@constants/categories';

export interface ServiceFormValues {
  title: string;
  description: string;
  price: string;
  durationMinutes: string;
  category: string;
}

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Service',
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [price, setPrice] = useState(initialValues?.price ?? '');
  const [durationMinutes, setDurationMinutes] = useState(
    initialValues?.durationMinutes ?? ''
  );
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const nextErrors: Record<string, string> = {};

    if (title.trim().length < 3) nextErrors.title = 'Title is too short.';
    if (description.trim().length < 10) {
      nextErrors.description = 'Add a bit more detail.';
    }
    if (!price || Number.isNaN(Number(price)) || Number(price) <= 0) {
      nextErrors.price = 'Enter a valid price.';
    }
    if (
      !durationMinutes ||
      Number.isNaN(Number(durationMinutes)) ||
      Number(durationMinutes) <= 0
    ) {
      nextErrors.durationMinutes = 'Enter a valid duration.';
    }
    if (category.trim().length < 2) {
      nextErrors.category = 'Enter at least one skill or category.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({ title, description, price, durationMinutes, category });
  };

  const selectSuggestion = (suggestion: string) => {
    const existing = category
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!existing.includes(suggestion)) {
      existing.push(suggestion);
      setCategory(existing.join(', '));
    }
  };

  return (
    <View>
      <Input
        label="Service title"
        placeholder="e.g. Classic Haircut"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
      />

      <Input
        label="Description"
        placeholder="Describe what's included..."
        value={description}
        onChangeText={setDescription}
        error={errors.description}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        className="min-h-[80px]"
      />

      <View className="flex-row gap-3">
        <View className="flex-1">
          <Input
            label="Price (GHS)"
            placeholder="50"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            error={errors.price}
          />
        </View>
        <View className="flex-1">
          <Input
            label="Duration (min)"
            placeholder="30"
            value={durationMinutes}
            onChangeText={setDurationMinutes}
            keyboardType="numeric"
            error={errors.durationMinutes}
          />
        </View>
      </View>

      <Input
        label="Skills & Categories"
        placeholder="e.g. Plumbing, Pipe fitting, Leak repair"
        value={category}
        onChangeText={setCategory}
        error={errors.category}
      />

      <Text className="mb-1.5 text-sm font-medium text-gray-700">
        Suggested categories
      </Text>
      <View className="mb-4 flex-row flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const isSelected = category
            .split(',')
            .map((s) => s.trim())
            .includes(cat.id);
          return (
            <Pressable
              key={cat.id}
              onPress={() => selectSuggestion(cat.id)}
              className={[
                'rounded-full px-3 py-1.5',
                isSelected ? 'bg-primary' : 'bg-white border border-gray-200',
              ].join(' ')}
            >
              <Text
                className={[
                  'text-xs font-medium',
                  isSelected ? 'text-white' : 'text-gray-700',
                ].join(' ')}
              >
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Button label={submitLabel} onPress={handleSubmit} isLoading={isSubmitting} fullWidth />
    </View>
  );
};
