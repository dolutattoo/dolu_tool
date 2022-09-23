import { Button, Stack, TextInput } from '@mantine/core';
import { closeAllModals } from '@mantine/modals';
import { useState } from 'react';
import { fetchNui } from '../../../../../../utils/fetchNui';

const RenameLocation = (props: {defaultName: string}) => {
  const { defaultName } = props
  const [newName, setNewName] = useState(defaultName);

  const isButtonDisabled = (string: string) => {
    if (string === '' || string === defaultName) { return true }
    return false
  }

  return (
    <Stack>
      <TextInput label="Location name" value={newName} onChange={(e) => setNewName(e.target.value)} />
      <Button
        fullWidth
        disabled={isButtonDisabled(newName)}
        variant="outline"
        placeholder={defaultName}
        onClick={() => {
          closeAllModals();
          if (newName !== '') {
            fetchNui('changeLocationName', {oldName: defaultName, newName: newName})
          }
        }}
      >
        Confirm
      </Button>
    </Stack>
  );
};

export default RenameLocation;
