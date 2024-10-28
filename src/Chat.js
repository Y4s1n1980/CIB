import React, { useState, useEffect, useRef } from 'react';
import Hero from './Hero';
import { collection, addDoc, query, onSnapshot, orderBy } from "firebase/firestore";
import { db, auth, storage } from './firebaseConfig'; 
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './Chat.css';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperclip, faMicrophone, faStop, faSmile } from '@fortawesome/free-solid-svg-icons';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);  // Estado para el archivo
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showPreview, setShowPreview] = useState(null);  // Estado para la vista previa de imágenes
  const [isRecording, setIsRecording] = useState(false);  // Estado para grabación de audio
  const [audioFile, setAudioFile] = useState(null); // Estado para el archivo de audio
  const messagesEndRef = useRef(null); // Referencia para el scroll automático
  const chatContainerRef = useRef(null); // Referencia al contenedor del chat
  const inputRef = useRef(null); // Referencia al campo de entrada de mensaje
  const mediaRecorderRef = useRef(null); // Referencia al MediaRecorder
  const currentUser = auth.currentUser; // Obtener el usuario actual

  // Cargar mensajes en tiempo real desde Firestore
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const loadedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, []);

  // Desplazar automáticamente hacia el final del contenedor de mensajes cuando se recibe uno nuevo
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight; 
    }
  }, [messages]);

  // Iniciar/Detener la grabación de audio
  const toggleRecording = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
    } else {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        const audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          setAudioFile(audioBlob);
        };

        mediaRecorder.start();
        setIsRecording(true);
      }).catch(error => {
        console.error("Error accessing microphone:", error);
      });
    }
  };

  // Enviar nuevo mensaje
  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    if (!newMessage && !file && !audioFile) {
      console.log("No message or file to send.");
      return;  // Evitar enviar si no hay texto ni archivo
    }

    let fileUrl = null;

    // Subir archivo si existe
    if (file) {
      try {
        const fileRef = ref(storage, `chat-files/${file.name}`);
        await uploadBytes(fileRef, file);
        console.log("Archivo subido:", file.name);
        fileUrl = await getDownloadURL(fileRef);
        console.log("URL del archivo:", fileUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        return;  // Si hay error en la subida, evitar continuar
      }
    }

    // Subir archivo de audio si existe
    if (audioFile) {
      try {
        const audioRef = ref(storage, `chat-audio/${Date.now()}.wav`);
        await uploadBytes(audioRef, audioFile);
        console.log("Audio subido");
        fileUrl = await getDownloadURL(audioRef);
        console.log("URL del audio:", fileUrl);
        setAudioFile(null);  // Limpiar el archivo de audio seleccionado
      } catch (error) {
        console.error("Error uploading audio:", error);
        return;  // Si hay error en la subida, evitar continuar
      }
    }

    // Datos del mensaje
    const messageData = {
      text: newMessage || "",  // Evitar enviar null
      createdAt: new Date(),
      uid: currentUser.uid,
      userName: currentUser.email,
    };

    // Incluir archivo en el mensaje si fue subido
    if (fileUrl) {
      messageData.fileUrl = fileUrl;
      messageData.fileName = file ? file.name : 'audio.wav';
    }

    try {
      await addDoc(collection(db, "messages"), messageData);
      console.log("Mensaje enviado con archivo:", messageData);
      setNewMessage('');  // Limpiar el campo de texto
      setFile(null);  // Limpiar el archivo seleccionado
      inputRef.current.focus();  // Enfocar nuevamente el campo de entrada
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsRecording(false);
    }
  };

  // Agregar emoji al mensaje
  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji.native);  // Agregar emoji seleccionado
    setShowEmojiPicker(false);  // Cerrar el selector de emojis
    inputRef.current.focus();  // Enfocar nuevamente el campo de entrada
  };

  // Manejar selección de archivo
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      inputRef.current.focus();  // Enfocar nuevamente el campo de entrada
    }
  };

  // Verificar si el archivo es una imagen
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif)$/i.test(fileName);
  };

  // Verificar si el archivo es un audio
  const isAudio = (fileName) => {
    return /\.(wav|mp3|ogg)$/i.test(fileName);
  };

  // Manejar el envío de mensajes con la tecla Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();  // Llamar a la función de enviar mensaje
    }
  };

  // Mostrar imagen en vista previa grande
  const handleImageClick = (imageUrl) => {
    setShowPreview(imageUrl);  // Establecer la imagen seleccionada en el estado
  };

  // Cerrar la vista previa de la imagen
  const handleClosePreview = () => {
    setShowPreview(null);  // Limpiar la vista previa
  };

  return (
    <>
      <Hero 
        title="Bienvenido al Chat de la Comunidad"
        subtitle="Comparte tus pensamientos y participa en la conversación"
        backgroundImage="../gallery-image20.jpg"
      />
      <div className="chat-page">
        <div className="chat-container">
          <div className="chat-messages" ref={chatContainerRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`chat-message ${message.uid === currentUser.uid ? 'sent' : 'received'}`}
              >
                <div className="message-header">
                  <span className="message-username">{message.userName}</span>
                  <span className="message-time">{new Date(message.createdAt.seconds * 1000).toLocaleTimeString()}</span>
                </div>
                <div className="message-content">
                  <p>{message.text}</p>
                  {message.fileUrl && (
                    isImage(message.fileName) ? (
                      <img 
                        src={message.fileUrl} 
                        alt={message.fileName} 
                        className="file-preview"
                        onClick={() => handleImageClick(message.fileUrl)}  // Mostrar vista previa al hacer clic
                      />
                    ) : isAudio(message.fileName) ? (
                      <audio controls className="audio-player">
                        <source src={message.fileUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      <a href={message.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                        📄 {message.fileName}
                      </a>
                    )
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chat-input">
            <div className="input-left">
              {/* Botón de emoji */}
              <button type="button" className="icon-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                <FontAwesomeIcon icon={faSmile} />
              </button>

              {/* Input para subir archivos */}
              <label className="icon-button">
                <FontAwesomeIcon icon={faPaperclip} />
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>

              {/* Botón de grabación de audio */}
              <button type="button" className="icon-button" onClick={toggleRecording}>
                <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} />
              </button>
            </div>

            {/* Campo de texto */}
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              className="text-input"
              onKeyDown={handleKeyDown}  // Capturar el evento de tecla Enter
              ref={inputRef}  // Referencia al campo de entrada
            />
            <button type="submit" className="send-button">Enviar</button>
          </form>

          {showEmojiPicker && (
            <Picker data={data} onEmojiSelect={addEmoji} />
          )}

          {/* Vista previa de la imagen seleccionada */}
          {showPreview && (
            <div className="image-preview-overlay" onClick={handleClosePreview}>
              <div className="image-preview-container">
                <img src={showPreview} alt="Vista previa" className="image-preview" />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;
