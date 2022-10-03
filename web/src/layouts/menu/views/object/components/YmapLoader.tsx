import { Button } from "@mantine/core"

const YmapLoader: React.FC = () => {

    return (
        <>
            <Button
              variant="outline"
              color="blue.4"
              onClick={() => {
                console.log('Load .ymap.xml file')
              }}
            >
              Load .ymap.xml
            </Button>
        </>
    )
}

export default YmapLoader