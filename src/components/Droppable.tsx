import { useDroppable } from "@dnd-kit/core";
import { Props } from "../types";
import { makeStyles } from "@fluentui/react-components";

export const Droppable = ({ id, children }: Props) => {
  const { isOver, setNodeRef } = useDroppable({ id });

  const style = {
    border: isOver ? "1px dotted blue" : "none",
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children}
    </div>
  );
};

const useDeleteStyles = makeStyles({
  delete_img_wrapper: {
    position: "fixed",
    right: "70px",
    top: "50px",

    "@media (max-width: 425px)" : {
      left: "50%",
      transform: "translate(-50%,0)",
      bottom: "10px",
      right: "auto",
      top: "auto"
    }
  },
  delete_img: {
    width: "50px",
    zIndex: "99",
  },
});

export const DeleteDroppable = () => {
  const styles = useDeleteStyles();

  const { isOver, setNodeRef } = useDroppable({
    id: "delete",
  });

  const deleteIconPath = isOver ? "/delete_open.svg" : "/delete_close.png";

  return (
    <div className={styles.delete_img_wrapper} ref={setNodeRef}>
      <img className={styles.delete_img} alt="delete icon" src={deleteIconPath} />
    </div>
  );
};
