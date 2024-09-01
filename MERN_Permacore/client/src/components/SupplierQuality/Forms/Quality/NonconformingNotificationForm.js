import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button } from '@mui/material';

const NonconformingNotificationForm = ({ data, onSave, onCancel }) => {
  const { control, handleSubmit } = useForm({
    defaultValues: {
      nonconformityDetails: data?.nonconformityDetails || '',
      severityLevel: data?.severityLevel || 'Minor',
      notes: data?.notes || '',
    }
  });

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="nonconformityDetails"
        control={control}
        render={({ field }) => <TextField {...field} label="Nonconformity Details" fullWidth />}
      />
      <Controller
        name="severityLevel"
        control={control}
        render={({ field }) => <TextField {...field} label="Severity Level" fullWidth />}
      />
      <Controller
        name="notes"
        control={control}
        render={({ field }) => <TextField {...field} label="Notes" fullWidth />}
      />
      <Button type="submit" color="primary" variant="contained">Save</Button>
      <Button onClick={onCancel} color="secondary" variant="contained">Cancel</Button>
    </form>
  );
};

export default NonconformingNotificationForm;
