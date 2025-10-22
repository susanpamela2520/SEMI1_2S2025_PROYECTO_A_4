import { useState } from 'react';
import './register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePhoto: null,
    favoriteGenres: []
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);

  const movieGenres = [
    'Acción',
    'Aventura',
    'Comedia',
    'Drama',
    'Terror',
    'Ciencia Ficción',
    'Romance',
    'Thriller',
    'Animación',
    'Documental',
    'Fantasía',
    'Crimen'
  ];

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    } else if (formData.username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'El formato del correo electrónico no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Debes confirmar la contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    if (!formData.profilePhoto) {
      newErrors.profilePhoto = 'La foto de perfil es requerida';
    }

    if (formData.favoriteGenres.length === 0) {
      newErrors.favoriteGenres = 'Selecciona al menos un género favorito';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors({
          ...errors,
          profilePhoto: 'Solo se permiten archivos JPG, PNG o WEBP'
        });
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors({
          ...errors,
          profilePhoto: 'La imagen no debe superar los 5MB'
        });
        return;
      }

      setFormData({
        ...formData,
        profilePhoto: file
      });

      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Limpiar error
      if (errors.profilePhoto) {
        setErrors({
          ...errors,
          profilePhoto: ''
        });
      }
    }
  };

  const handleGenreToggle = (genre) => {
    const currentGenres = [...formData.favoriteGenres];
    const index = currentGenres.indexOf(genre);

    if (index > -1) {
      currentGenres.splice(index, 1);
    } else {
      currentGenres.push(genre);
    }

    setFormData({
      ...formData,
      favoriteGenres: currentGenres
    });

    // Limpiar error
    if (errors.favoriteGenres && currentGenres.length > 0) {
      setErrors({
        ...errors,
        favoriteGenres: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Aquí se enviaría la data al API
    // La foto se subiría a AWS S3
    // La contraseña se encriptaría en el backend
    console.log('Datos del formulario:', formData);
    
    // Simular envío
    alert('¡Registro exitoso! (Integrar con API)');
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h1>Crear Cuenta</h1>
          <p>Únete a nuestra comunidad cinéfila</p>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          {/* Nombre Completo */}
          <div className="form-group">
            <label htmlFor="fullName">Nombre Completo *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={errors.fullName ? 'error' : ''}
              placeholder="Juan Pérez"
            />
            {errors.fullName && <span className="error-message">{errors.fullName}</span>}
          </div>

          {/* Nombre de Usuario */}
          <div className="form-group">
            <label htmlFor="username">Nombre de Usuario *</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={errors.username ? 'error' : ''}
              placeholder="juanperez123"
            />
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {/* Correo Electrónico */}
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'error' : ''}
              placeholder="correo@ejemplo.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={errors.password ? 'error' : ''}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirmar Contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Repite tu contraseña"
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Foto de Perfil */}
          <div className="form-group">
            <label htmlFor="profilePhoto">Foto de Perfil *</label>
            <div className="photo-upload">
              <input
                type="file"
                id="profilePhoto"
                accept="image/jpeg,image/png,image/jpg,image/webp"
                onChange={handlePhotoChange}
                className="file-input"
              />
              <label htmlFor="profilePhoto" className="file-label">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="photo-preview" />
                ) : (
                  <div className="photo-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Seleccionar imagen</span>
                  </div>
                )}
              </label>
            </div>
            {errors.profilePhoto && <span className="error-message">{errors.profilePhoto}</span>}
          </div>

          {/* Géneros Favoritos */}
          <div className="form-group">
            <label>Géneros Cinematográficos Favoritos *</label>
            <div className="genres-grid">
              {movieGenres.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={`genre-btn ${formData.favoriteGenres.includes(genre) ? 'selected' : ''}`}
                  onClick={() => handleGenreToggle(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
            {errors.favoriteGenres && <span className="error-message">{errors.favoriteGenres}</span>}
          </div>

          {/* Botón de Submit */}
          <button type="submit" className="submit-btn">
            Registrarse
          </button>

          <div className="login-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;