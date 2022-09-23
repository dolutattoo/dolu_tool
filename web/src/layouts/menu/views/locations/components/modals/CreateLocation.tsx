import { useState } from 'react';
import { closeAllModals } from '@mantine/modals';
import { Stack, Button, TextInput, Checkbox } from '@mantine/core';

const CreateLocation: React.FC = () => {
  const [value, setValue] = useState('');

  return (
    <Stack>
      <TextInput label="Location name" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button uppercase variant="light" onClick={() => closeAllModals()}>
        Create location
      </Button>
    </Stack>
  );
};

export default CreateLocation;
