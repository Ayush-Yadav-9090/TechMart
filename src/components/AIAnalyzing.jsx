import { motion } from "framer-motion";

const AIAnalyzing = () => {
  return (
    <div style={styles.wrapper}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        style={styles.text}
      >
        AI is analyzing your preferences...
      </motion.p>
    </div>
  );
};

const styles = {
  wrapper: {
    height: "60vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: "1.3rem",
    fontWeight: 500,
    color: "#666",
    letterSpacing: "0.5px",
  },
};

export default AIAnalyzing;
