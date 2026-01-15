import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from '../common/input';
import { Button } from '../common/button';
import { reminderSchema } from '../../utils/validation';
import { CreateReminderRequest } from '../../types';

interface ReminderFormProps {
  initialValues?: Partial<CreateReminderRequest>;
  onSubmit: (data: CreateReminderRequest) => void;
  loading?: boolean;
}

export const ReminderForm: React.FC<ReminderFormProps> = ({
  initialValues,
  onSubmit,
  loading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateReminderRequest>({
    resolver: yupResolver(reminderSchema),
    defaultValues: initialValues,
  });
  useEffect(() => {
    if (initialValues) {
      reset(initialValues);
    }
  }, [initialValues, reset]);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        name="title"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Title"
            placeholder="Enter reminder title"
            value={value}
            onChangeText={onChange}
            error={errors.title?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Description"
            placeholder="Enter description"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={3}
          />
        )}
      />

      <Controller
        control={control}
        name="radius"
        render={({ field: { onChange, value } }) => (
          <Input
            label="Radius (meters)"
            placeholder="100"
            value={value?.toString()}
            onChangeText={text => onChange(parseInt(text) || 0)}
            keyboardType="numeric"
            error={errors.radius?.message}
          />
        )}
      />

      <Button
        title="Save Reminder"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});