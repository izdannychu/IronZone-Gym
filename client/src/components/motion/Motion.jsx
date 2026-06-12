import { motion, useReducedMotion } from 'framer-motion';

const ease = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, className = '', delay = 0, amount = 0.18 }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
};

export const Stagger = ({ children, className = '', amount = 0.12 }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={reduced ? false : 'hidden'}
      whileInView={reduced ? undefined : 'visible'}
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.09, delayChildren: 0.08 } }
      }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className = '' }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={reduced ? undefined : {
        hidden: { opacity: 0, y: 22 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.58, ease } }
      }}
    >
      {children}
    </motion.div>
  );
};

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.32, ease }
};
