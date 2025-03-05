import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to MyApp',
      increment: 'Increment',
      decrement: 'Decrement',
      details: 'Go to Details',
      dashboard:'Go To Dashboard',
      recovery:'Go to recovery',
      back: 'Go Back',
      toggleTheme: 'Toggle Theme',
      changeLang: 'Change Language',
    },
  },
  es: {
    translation: {
      welcome: 'Bienvenido a MyApp',
      increment: 'Incrementar',
      decrement: 'Disminuir',
      details: 'Ir a Detalles',
      back: 'Regresar',
      toggleTheme: 'Cambiar Tema',
      changeLang: 'Cambiar Idioma',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
