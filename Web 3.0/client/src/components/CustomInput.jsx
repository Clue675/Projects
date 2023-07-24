import React from 'react';
import styles from '../styles';

const regex = /^[A-Za-z0-9]+$/;

const CustomInput = ({ label, placeHolder, value, handleValueChange }) => {
  // Event handler for input change
  const handleChange = (e) => {
    if (e.target.value === '' || regex.test(e.target.value)) {
      handleValueChange(e.target.value);
    }
  };

  return (
    <>
      <label htmlFor="name" className={styles.label}>
        {label}
      </label>
      <input
        type="text"
        placeholder={placeHolder}
        value={value}
        onChange={handleChange}
        className={styles.input}
      />
    </>
  );
};

export default CustomInput;
