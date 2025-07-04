import React from 'react';
import './TaskOne.css';

// Пользовательский хук для управления формой
const useForm = (onSubmitCallback) => {
  // Состояния формы
  const [values, setValues] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = React.useState('');

  // Обработчик изменений полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues(prev => ({ ...prev, [name]: value }));
  };

  // Валидация формы
  const validate = () => {
    // Проверка имени и фамилии
    if (!values.firstName.trim()) {
      setError('First name is required');
      return false;
    }
    if (!values.lastName.trim()) {
      setError('Last name is required');
      return false;
    }

    // Валидация email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      setError('Please enter a valid email');
      return false;
    }

    // Валидация пароля
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;
    if (!passwordRegex.test(values.password)) {
      setError('Password must be at least 5 characters, include a number and a special character');
      return false;
    }

    // Подтверждение пароля
    if (values.confirmPassword !== values.password) {
      setError('Passwords do not match');
      return false;
    }

    setError('');
    return true;
  };

  // Обработчик отправки формы
  const submitForm = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmitCallback(values);
      // Сброс значений после отправки
      setValues({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    }
  };

  return {
    submitForm,
    handleChange,
    values,
    error
  };
};

function TaskOne() {
  // Использование кастомного хука
  const { 
    submitForm, 
    handleChange, 
    values, 
    error 
  } = useForm((formData) => {
    // Обработка успешной отправки
    alert(JSON.stringify(formData, null, 2));
  });

  return (
    <div className="form-container">
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={submitForm}>
        <input 
          type="text" 
          name="firstName" 
          placeholder="First Name" 
          className="form-input"
          onChange={handleChange} 
          value={values.firstName}
        />
        <input 
          type="text" 
          name="lastName" 
          placeholder="Last Name" 
          className="form-input"
          onChange={handleChange} 
          value={values.lastName}
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className="form-input"
          onChange={handleChange} 
          value={values.email}
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          className="form-input"
          onChange={handleChange} 
          value={values.password}
        />
        <input 
          type="password" 
          name="confirmPassword" 
          placeholder="Confirm Password" 
          className="form-input"
          onChange={handleChange} 
          value={values.confirmPassword}
        />
        <button type="submit" className="form-button">Register</button>
      </form>
    </div>
  );
}

export default TaskOne;
