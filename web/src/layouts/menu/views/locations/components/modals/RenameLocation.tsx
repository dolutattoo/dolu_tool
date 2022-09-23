import { Button, Stack, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useState } from 'react';
import { useSelectedLocation } from '../../../../../../atoms/location';

const RenameLocation: React.FC = () => {
  const [value, setValue] = useState(useSelectedLocation()!.name);

  return (
    <Stack>
      <TextInput label="Location name" value={value} onChange={(e) => setValue(e.target.value)} />
      <Button
        fullWidth
        variant="light"
        uppercase
        onClick={() => {
          closeAllModals();
          // fetchNui('changeLocationName', value)
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
};

export default RenameLocation;
