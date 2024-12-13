import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    emailjs
    .sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      form.current,
      { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
    )
      .then(
        () => {
          console.log('SUCCESS!');
          setSubmitStatus('success');
          form.current.reset();
        },
        (error) => {
          console.log('FAILED...', error.text);
          setSubmitStatus('error');
        },
      )
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className='bg-gray-100 pt-20'>
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-bold md:text-4xl md:leading-tight dark:text-white bg-clip-text py-4">Contact Me</h2>
      </div>
      <div className="mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-x-16 gap-y-8 lg:grid-cols-5">
          <div className="lg:col-span-2 lg:py-12">
            <p className="max-w-xl text-lg">
              Thank you for visiting my Blog App! I truly appreciate your thoughts and feedback, and I'd love to hear from you. Whether you have questions, comments, or collaboration ideas, please fill out the contact form below. Your input means a lot to me, and I'll do my best to respond promptly. I'm excited to connect with you and make this blog even better together!
            </p>
            <div className="mt-8">
              <a href="#" className="text-2xl font-bold text-pink-600">Charan Teja Chukkala</a>
              <address className="mt-2 not-italic">Tech Enthusiast | Web Developer | Programmer</address>
            </div>
          </div>
          <div className="rounded-lg bg-white p-8 shadow-lg lg:col-span-3 lg:p-12">
            <form ref={form} onSubmit={sendEmail} className='space-y-4'>
              <InputField label="Name" name="from_name" type="text" required />
              <InputField label="Email" name="from_email" type="email" required />
              <InputField label="Subject" name="from_subject" type="text" required />
              <TextAreaField label="Message" name="from_message" rows={8} required />
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`inline-block w-full rounded-lg px-5 py-3 font-medium text-white sm:w-auto ${
                    isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
                  }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                Thank you for your message! I'll get back to you soon.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                Oops! Something went wrong. Please try again later.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ label, name, type, required }) => (
  <div>
    <label className="sr-only" htmlFor={name}>{label}</label>
    <input
      className="w-full rounded-lg border-gray-200 p-3 text-sm"
      placeholder={label}
      type={type}
      id={name}
      name={name}
      required={required}
    />
  </div>
);

const TextAreaField = ({ label, name, rows, required }) => (
  <div>
    <label className="sr-only" htmlFor={name}>{label}</label>
    <textarea
      className="w-full rounded-lg border-gray-200 p-3 text-sm"
      placeholder={label}
      rows={rows}
      id={name}
      name={name}
      required={required}
    ></textarea>
  </div>
);

export default Contact;