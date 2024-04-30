import { Image, Paper, Transition } from '@mantine/core'
import { useRecoilValue } from 'recoil'
import { displayImageAtom, imagePathAtom } from '../../atoms/imgPreview'

const ImgPreview: React.FC = () => {
  const isDisplayImage = useRecoilValue(displayImageAtom)
  const imagePath = useRecoilValue(imagePathAtom)

  return (
    <Transition transition='slide-right' mounted={isDisplayImage}>
      {(style) => (
        <Paper
          p='xs'
          shadow='xs'
          style={style}
          sx={{
            zIndex: 2,
            position: 'absolute',
            top: '2%',
            left: '650px',
            maxWidth: '600px',
            borderRadius: '10px',
          }}
        >
          <Image
            fit='contain'
            alt={'Display selected image'}
            src={imagePath}
            withPlaceholder={true}
          />
        </Paper>
      )}
    </Transition>
  )
}

export default ImgPreview