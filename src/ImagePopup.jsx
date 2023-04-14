import { useClickClose, useEscClose } from './utils/useClose';
import './scss/ImagePopup.scss';

function ImagePopup({ link, isOpen, onClose }) {
  useClickClose(isOpen, onClose, 'popup_opened');
  useEscClose(isOpen, onClose);
  return (
    <div className={`popup popup__photo ${isOpen && 'popup_opened'}`}>
      <div className="popup__photo-container">
        <img className="popup__image" src={link} alt="Фото товара" />
        <button type="button" className="popup__close-button" onClick={onClose}></button>
      </div>
    </div>
  );
}
export default ImagePopup;
