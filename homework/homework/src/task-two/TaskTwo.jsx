import React, { useCallback, useMemo, memo, useRef } from 'react';
import RenderCounter from './render-counter/RenderCounter';
import './TaskTwo.css';

// Хук для принудительного обновления компонента
function useUpdate() {
  const [, setCount] = React.useState(0);
  return useCallback(() => {
    setCount(counter => counter + 1);
  }, []);
}

// Оптимизированный компонент ввода
const Input = memo(({ onChange }) => {
  const renderCount = useRef(0);
  renderCount.current++;
  
  return (
    <div className="input-container">
      <input 
        type="text" 
        className="input-field" 
        name="value" 
        onChange={onChange} 
      />
      <RenderCounter count={renderCount.current} />
    </div>
  );
});

// Оптимизированный корневой компонент формы
const Root = memo(() => {
  const [value, setValue] = React.useState('');
  const renderCount = useRef(0);
  renderCount.current++;
  
  // Стабилизированный обработчик изменений
  const handleChange = useCallback((event) => {
    setValue(event.target.value);
  }, []);
  
  // Мемоизированное значение для отображения
  const displayedValue = useMemo(() => `Введенное значение: ${value}`, [value]);

  return (
    <form className="form-container">
      {displayedValue}
      <RenderCounter count={renderCount.current} />
      <Input onChange={handleChange} />
    </form>
  );
});

// Главный компонент
export default function TaskTwo() {
  const update = useUpdate();
  const renderCount = useRef(0);
  renderCount.current++;
  
  return (
    <div className="TaskTwo">
      <button onClick={update}>Обновить компонент</button>
      <RenderCounter count={renderCount.current} />
      <Root />
    </div>
  );
}
