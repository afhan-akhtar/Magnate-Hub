import styles from "./Loading.module.css";

type LoadingProps = {
  loadingText?: string; 
};

const Loading = ({ loadingText }: LoadingProps) => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>{loadingText}</p>
    </div>
  );
};

export default Loading;
