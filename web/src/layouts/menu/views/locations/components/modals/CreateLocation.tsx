import { useState } from 'react';
import { closeAllModals } from '@mantine/modals';
import { Stack, Button, TextInput } from '@mantine/core';

const CreateLocation: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Stack>
      <TextInput label="Location name" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        uppercase
        variant="outline"
        color="orange"
        onClick={() => {
          closeAllModals()
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
};

export default CreateLocation;
