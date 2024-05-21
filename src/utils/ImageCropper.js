import { useState, useRef } from "react";
import ReactCrop, {
  makeAspectCrop,
  centerCrop,
  convertToPixelCrop,
} from "react-image-crop";
import setCanvasPreview from "./SetCanvasPreview";

export default function ImageCropper({ closeModal, updateProfilePicture }) {
  const imgRef = useRef(null);
  const previewCanvasRef = useRef(null);
  const [source, setSource] = useState("");
  const [crop, setCrop] = useState();
  const [error, setError] = useState("");
  const min_dimension = 150;

  const onSelectFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageURL = reader.result?.toString() || "";
      imageElement.src = imageURL;
      imageElement.addEventListener("load", (event) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = event.currentTarget;
        if (naturalWidth < min_dimension || naturalHeight < min_dimension) {
          setError(
            "Image is too small - choose an image that's at least 150px by 150px."
          );
          return setSource("");
        }
      });
      setSource(imageURL);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (event) => {
    const { width, height } = event.currentTarget;
    const cropWidthPercentage = (min_dimension / width) * 100;
    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthPercentage,
      },
      1,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <label className="block mb-3 w-fit">
        <span className="sr-only">Choose profile photo</span>
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          className="block w-full text-sm text-primary-yellow p-4 file:mr-4 file:py-2 file:px-3 
            file:rounded-full file:border-0 file:text-xs file:bg-primary-red file:text-white hover:file:bg-gray-600"
        />
      </label>
      {error && <p className="text-primary-red text-xs ml-5">{error}</p>}
      {source && (
        <div className="flex flex-col items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            keepSelection
            aspect={1}
            minWidth={"25%"}
          >
            <img
              ref={imgRef}
              src={source}
              alt="Upload"
              style={{ maxHeight: "70vh" }}
              onLoad={onImageLoad}
            />
          </ReactCrop>
          <button
            className="w-full p-2 bg-primary-blue hover:bg-primary-red border border-secondary-blue text-white text-sm"
            onClick={() => {
              setCanvasPreview(
                imgRef.current,
                previewCanvasRef.current,
                convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
              );
              const dataUrl = previewCanvasRef.current.toDataURL();
              updateProfilePicture(dataUrl);
              closeModal();
            }}
          >
          Save Photo        
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 300,
            height: 300,
          }}
        />
      )}
    </>
  );
}
