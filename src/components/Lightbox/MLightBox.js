import React from 'react';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export default function MLightBox({ lightBox, setLightBox, title }) {
  return (
    <Lightbox
      mainSrc={lightBox.images[lightBox.selectedindex]}
      nextSrc={
        lightBox.selectedindex + 1 > lightBox.images.length
          ? undefined
          : lightBox.images[lightBox.selectedindex + 1]
      }
      prevSrc={
        lightBox.selectedindex - 1 < 0 ? undefined : lightBox.images[lightBox.selectedindex - 1]
      }
      onCloseRequest={() => setLightBox({ ...lightBox, open: false })}
      onMovePrevRequest={() =>
        setLightBox({
          ...lightBox,
          selectedindex: (lightBox.selectedindex - 1) % lightBox.images.length
        })
      }
      onMoveNextRequest={() =>
        setLightBox({
          ...lightBox,
          selectedindex: (lightBox.selectedindex + 1) % lightBox.images.length
        })
      }
      imageTitle={title}
      enableZoom={false}
    />
  );
}
