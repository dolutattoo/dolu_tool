import { getInteriorData } from "../../../../../atoms/interior"

const InteriorElement: React.FC = () => {
    const interior = getInteriorData()

    return (
        <>
            {"Current interior id: " + interior.interiorId}
        </>
    )
}

export default InteriorElement