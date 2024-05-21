import ImageCropper from './ImageCropper'

const Modal = ({ updateProfilePicture, closeModal }) => {
  return (
    <div
      className="relative z-10"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-tertiary-blue bg-opacity-75 transition-all backdrop-blur-sm"></div>
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full justify-center px-2 py-12 text-center">
          <div className="relative w-[95%] sm:w-[80%] min-h-[50vh] bg-secondary-blue text-white text-left shadow-xl transition-all">
            <div className="flex flex-row-reverse justify-between items-center">
              <button
                type="button"
                className="rounded-md text-white hover:bg-gray-700 focus:outline-none mb-4 mr-5 p-2"
                onClick={closeModal}
              >
                <span className='sr-only'>Close Menu</span>
                X 
              </button>
              <ImageCropper closeModal={closeModal} updateProfilePicture={updateProfilePicture}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;