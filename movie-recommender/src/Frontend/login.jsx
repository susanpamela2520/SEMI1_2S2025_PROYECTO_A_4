import { useState } from 'react';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    credential: '', // Puede ser username o email
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.credential.trim()) {
      newErrors.credential = 'Este campo es requerido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });

    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Aquí se integrará con la API
      const response = await fetch('TU_API_URL/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          credential: formData.credential,
          password: formData.password,
          rememberMe: formData.rememberMe
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Mensaje de error genérico para proteger información de usuarios
        setErrors({
          general: 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.'
        });
        setIsLoading(false);
        return;
      }

      // Si el login es exitoso
      // Guardar token según la opción "Recordar sesión"
      if (formData.rememberMe) {
        // LocalStorage persiste entre sesiones del navegador
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
      } else {
        // SessionStorage se borra al cerrar el navegador
        sessionStorage.setItem('authToken', data.token);
        sessionStorage.setItem('userData', JSON.stringify(data.user));
      }

      // Redirigir al dashboard o página principal
      console.log('Login exitoso:', data);
      alert('¡Inicio de sesión exitoso! (Integrar redirección)');
      // window.location.href = '/dashboard';

    } catch (error) {
      console.error('Error en el login:', error);
      setErrors({
        general: 'Error al conectar con el servidor. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo">🎬</div>
          <h1>Bienvenido de nuevo</h1>
          <p>Ingresa a tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {/* Error general */}
          {errors.general && (
            <div className="alert alert-error">
              <span className="alert-icon">⚠</span>
              <span>{errors.general}</span>
            </div>
          )}

          {/* Usuario o Email */}
          <div className="form-group">
            <label htmlFor="credential">Usuario o Correo Electrónico</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input
                type="text"
                id="credential"
                name="credential"
                value={formData.credential}
                onChange={handleInputChange}
                className={errors.credential ? 'error' : ''}
                placeholder="usuario o correo@ejemplo.com"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
            {errors.credential && (
              <span className="error-message">{errors.credential}</span>
            )}
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={errors.password ? 'error' : ''}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Opciones adicionales */}
          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              <span className="checkbox-custom"></span>
              <span>Recordar sesión</span>
            </label>

            <a href="/forgot-password" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </a>
          </div>

          {/* Botón de submit */}
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>

          {/* Divider */}
          <div className="divider">
            <span>o</span>
          </div>

          {/* Link a registro */}
          <div className="register-link">
            ¿No tienes cuenta?{' '}
            <a href="/register">Regístrate aquí</a>
          </div>
        </form>

        {/* Footer de seguridad */}
        <div className="security-footer">
          <span className="security-icon">🔐</span>
          <p>Tu sesión está protegida con encriptación de extremo a extremo</p>
        </div>
      </div>
    </div>
  );
};

export default Login;