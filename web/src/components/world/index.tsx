import { Slider } from "@mantine/core"

const World = () => {

  return (
    <>

      <Slider
        marks={[
          { value: 25, label: 'Morning' },
          { value: 50, label: 'Noon' },
          { value: 75, label: 'Afternoon' },
          { value: 100, label: 'Midnight' },
        ]}
      />
    </>
  )
}

export default World