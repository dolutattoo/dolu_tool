import { Button, Stack, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useState } from 'react';
import { fetchNui } from '../../../../../../utils/fetchNui';

const RenameLocation = (props: {defaultName: string}) => {
  const { defaultName } = props
  const [newName, setNewName] = useState(defaultName);

  return (
    <Stack>
      <TextInput label="Location name" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <Button
        uppercase
        disabled={newName === '' || newName === defaultName}
        variant="outline"
        color="orange"
        placeholder={defaultName}
        onClick={() => {
          closeAllModals();
          if (newName !== '') {
            fetchNui('dmt:changeLocationName', {oldName: defaultName, newName: newName})
          }
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
};

export default RenameLocation;
