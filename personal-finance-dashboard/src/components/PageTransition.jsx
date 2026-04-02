import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1], // custom cubic-bezier (smooth deceleration)
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.99,
    filter: 'blur(3px)',
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 1, 1],
    },
  },
};

const childVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 24,
    },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

/**
 * Wrap each page's content in <PageTransition> for cinematic enter/exit.
 * Children wrapped in <PageTransition.Item> get staggered entrance.
 */
export function PageTransition({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={`page-transition ${className}`}
    >
      {children}
    </motion.div>
  );
}

PageTransition.Item = function PageTransitionItem({ children, className = '' }) {
  return (
    <motion.div variants={childVariants} className={className}>
      {children}
    </motion.div>
  );
};
