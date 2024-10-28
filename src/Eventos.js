import React from 'react';
import './Eventos.css'; // Importa el archivo CSS para la sección de eventos

const Eventos = () => {
    return (
        <div className="eventos-page">
            {/* Hero Section */}
            <section className="eventos-hero">
                <h1>Eventos de la Comunidad Islámica de Blanes</h1>
                <p>Descubre nuestros eventos pasados y futuros</p>
            </section>

            {/* Listado de eventos en 2 filas */}
            <section className="eventos-list">
                <div className="eventos-grid">
                    {/* Evento 1 */}
                    <div className="evento-item">
                        <img src="/evento1.webp" alt="Evento Instalaciones asombrosas" />
                        <h3>Instalaciones asombrosas</h3>
                        <p>Fecha: 10 de Octubre, 2024</p>
                        <p>Descripción: Ven y visita nuestras instalaciones renovadas y modernas.</p>
                        <p>Hora: 10:00 AM</p>
                        <p>Lugar: Mezquita Annour, Blanes</p>
                    </div>

                    {/* Evento 2 */}
                    <div className="evento-item">
                        <img src="/evento2.webp" alt="Evento Ayudando a la comunidad" />
                        <h3>Ayudando a la comunidad</h3>
                        <p>Fecha: 15 de Octubre, 2024</p>
                        <p>Descripción: Un evento dedicado a brindar ayuda a las familias necesitadas de la comunidad.</p>
                        <p>Hora: 4:00 PM</p>
                        <p>Lugar: Centro Comunitario</p>
                    </div>

                    {/* Evento 3 */}
                    <div className="evento-item">
                        <img src="/evento3.webp" alt="Evento Lidera eventos benéficos" />
                        <h3>Lidera eventos benéficos</h3>
                        <p>Fecha: 20 de Octubre, 2024</p>
                        <p>Descripción: Evento benéfico para recaudar fondos para los más necesitados.</p>
                        <p>Hora: 6:00 PM</p>
                        <p>Lugar: Mezquita Annour, Blanes</p>
                    </div>

                    {/* Evento 4 */}
                    <div className="evento-item">
                        <img src="evento4.webp" alt="Evento Escolarización de los niños" />
                        <h3>Escolarización de los niños</h3>
                        <p>Fecha: 25 de Octubre, 2024</p>
                        <p>Descripción: Programa especial para ayudar a los niños en su educación.</p>
                        <p>Hora: 8:00 AM</p>
                        <p>Lugar: Escuela Comunitaria</p>
                    </div>

                    {/* Evento 5 */}
                    <div className="evento-item">
                        <img src="/evento5.webp" alt="Evento Conferencia sobre el Islam" />
                        <h3>Conferencia sobre el Islam</h3>
                        <p>Fecha: 30 de Octubre, 2024</p>
                        <p>Descripción: Una conferencia abierta para aprender sobre los principios del Islam.</p>
                        <p>Hora: 3:00 PM</p>
                        <p>Lugar: Centro Islámico de Blanes</p>
                    </div>

                    {/* Evento 6 */}
                    <div className="evento-item">
                        <img src="/evento6.webp" alt="Evento Taller de Escritura Islámica" />
                        <h3>Taller de Escritura Islámica</h3>
                        <p>Fecha: 5 de Noviembre, 2024</p>
                        <p>Descripción: Un taller práctico para aprender caligrafía islámica.</p>
                        <p>Hora: 11:00 AM</p>
                        <p>Lugar: Sala de Conferencias</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Eventos;
