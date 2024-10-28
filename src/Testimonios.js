import React, { useState, useEffect } from 'react';
import Hero from './Hero';
import { storage, db } from './firebaseConfig'; 
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection, getDocs } from 'firebase/firestore'; // Elimina query, orderBy, limit
import { useUser } from './UserContext'; //
import Slider from 'react-slick';
import './Testimonios.css';

const Testimonios = () => {
  const { user } = useUser(); // Obtiene la información del usuario
  const [testimonios, setTestimonios] = useState([]); // Estado para guardar los testimonios
  const [newTestimonio, setNewTestimonio] = useState(''); // Texto del nuevo testimonio
  const [name, setName] = useState(''); // Nombre del usuario
  const [imageFile, setImageFile] = useState(null); // Estado para la imagen

  const settings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 6000,
    cssEase: "ease-in-out",
    pauseOnHover: true
  };

  // Fetch de testimonios desde Firestore
  useEffect(() => {
    const fetchTestimonios = async () => {
      const testimoniosSnapshot = await getDocs(collection(db, 'testimonios'));
      const testimoniosData = testimoniosSnapshot.docs.map((doc) => doc.data());
      setTestimonios(testimoniosData);
    };

    fetchTestimonios();
  }, []);

  // Función para subir la imagen a Firebase Storage
  const handleImageUpload = async () => {
    if (imageFile) {
      const storageRef = ref(storage, `testimonios/${imageFile.name}`);
      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
    return null; // Si no hay imagen, devuelve null
  };

  // Función para enviar un nuevo testimonio
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Debes iniciar sesión para dejar un testimonio');
      return;
    }

    try {
      const imageUrl = await handleImageUpload(); // Sube la imagen si hay una

      await addDoc(collection(db, 'testimonios'), {
        name: user.displayName || name,
        text: newTestimonio,
        imageUrl: imageUrl || '', // Guarda la URL o vacío si no hay imagen
        createdAt: new Date(),
      });

      alert('Testimonio enviado con éxito');
      setNewTestimonio('');
      setName('');
      setImageFile(null); // Restablece el archivo de imagen
    } catch (error) {
      console.error('Error al enviar el testimonio: ', error);
    }
  };

  return (
    <>
      <Hero 
        title="Lo que dicen nuestros visitantes"
        subtitle="Tu experiencia es importante para nosotros"
        backgroundImage={"../gallery-image19.jpg" || ''}
      />
      <section className="testimonios-section">
        <h2 className="testimonios-title">Lo que dicen nuestros visitantes</h2>

        {/* Slider con los testimonios */}
        <Slider {...settings}>
          {testimonios.length > 0 ? testimonios.map((testimonio, index) => (
            <div key={index} className="testimonio-container">
              <div className="testimonio-content">
                <img
                  src={testimonio.imageUrl || `/profile${index + 1}.jpg`} // Muestra la imagen subida o una predeterminada
                  alt={testimonio.name}
                  className="testimonio-image"
                />
                <h3 className="testimonio-name">{testimonio.name}</h3>
                <p className="testimonio-text">
                  {testimonio.text}
                </p>
              </div>
            </div>
          )) : <p>No hay testimonios disponibles.</p>}
        </Slider>

        {/* Formulario para agregar un nuevo testimonio */}
        <form onSubmit={handleSubmit} className="testimonio-form">
          <h3>Deja tu testimonio</h3>
          <input
            type="text"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Tu testimonio"
            value={newTestimonio}
            onChange={(e) => setNewTestimonio(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])} // Opción para cargar una imagen
          />
          <button type="submit">Enviar</button>
        </form>
      </section>
    </>
  );
};

export default Testimonios;
