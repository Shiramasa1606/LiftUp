import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css'; // Asegúrate de importar los estilos
import { Navigation, Pagination } from 'swiper/modules'; // Importa los módulos necesarios

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  return (
    <Swiper
      modules={[Navigation, Pagination]}
      spaceBetween={30}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      loop={images.length > 1} // Permite el loop solo si hay más de una imagen
      style={{ width: '100%', height: '400px' }} // Ajusta el tamaño según tus necesidades
    >
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img
            src={image}
            alt={`Imagen ${index + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover', // Esto ajusta la imagen para cubrir el área sin deformarse
            }}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
