import { makeStyles } from "@fluentui/react-components";

const useStyles = makeStyles({
  task: {
    background: "#0f6cbd",
    borderRadius: "8px",
    color: "#ffffff",
    padding: "8px",
    cursor: "grab",
    fontSize: "16px",
  },
});

export const TaskItem = ({ subject }: { subject: string }) => {
  const styles = useStyles();
  return <div className={styles.task}>{subject}</div>;
};
