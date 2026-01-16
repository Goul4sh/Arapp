import styles from "../../admin/pages/adminGlobalStyles.module.css";
import Modal from "../../review/Modal.tsx";



interface ExitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}


function ExitModal({isOpen, onClose, onConfirm}: ExitModalProps) {

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Wyjście z ćwiczenia"
        >
            <div className={styles.deleteConfirmationModal}>
                <h2>Jesteś pewien, że chcesz wyjść?</h2>
                <p>Obecny postęp nie zostanie zapisany.</p>
                <div className={styles.leaveConfirmationButtons}>
                    <button
                        className={styles.confirmDeleteButton}
                        onClick={onConfirm}
                    >
                        Tak, wyjdź
                    </button>
                    <button
                        className={styles.cancelDeleteButton}
                        onClick={() => onClose()}
                    >
                        Anuluj
                    </button>
                </div>
            </div>
        </Modal>


    )
};
export default ExitModal;