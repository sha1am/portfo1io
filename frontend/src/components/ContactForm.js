import React, { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Your Name" onChange={handleChange} />
      <input type="email" name="email" placeholder="Your Email" onChange={handleChange} />
      <textarea name="message" placeholder="Your Message" onChange={handleChange}></textarea>
      <button type="submit">Send</button>
    </form>
  );
};

export default ContactForm;
