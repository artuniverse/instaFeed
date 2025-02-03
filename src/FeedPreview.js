import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Rnd } from "react-rnd";
import html2canvas from "html2canvas";

const FeedPreview = () => {
  const [palette, setPalette] = useState([]);
  const [images, setImages] = useState([]);

  const onDropPalette = (acceptedFiles) => {
    setPalette(acceptedFiles.map(file => URL.createObjectURL(file)));
  };

  const onDropImages = (acceptedFiles) => {
    setImages([...images, ...acceptedFiles.map(file => ({
      id: Math.random(),
      src: URL.createObjectURL(file),
      x: 0,
      y: 0,
    }))]);
  };

  const saveImage = () => {
    html2canvas(document.getElementById("preview"), { useCORS: true }).then(canvas => {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "feed-preview.png";
      link.click();
    });
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* 컬러 팔레트 업로드 */}
      <div {...useDropzone({ onDrop: onDropPalette })} className="border p-4 w-80 text-center cursor-pointer">
        컬러 팔레트 업로드 (드래그앤드롭)
      </div>
      <div className="grid grid-cols-3 gap-2 my-4">
        {palette.map((src, index) => (
          <div key={index} className="w-20 h-20" style={{ backgroundColor: src }}></div>
        ))}
      </div>
      
      {/* 사진 업로드 */}
      <div {...useDropzone({ onDrop: onDropImages })} className="border p-4 w-80 text-center cursor-pointer">
        사진 업로드 (드래그앤드롭)
      </div>
      
      {/* 피드 프리뷰 */}
      <div id="preview" className="relative w-80 h-80 border my-4 overflow-hidden bg-gray-100">
        {palette.length > 0 && <div className="absolute inset-0 flex flex-wrap">
          {palette.map((color, i) => (
            <div key={i} className="w-1/3 h-1/3" style={{ backgroundColor: color }}></div>
          ))}
        </div>}
        {images.map((img) => (
          <Rnd
            key={img.id}
            default={{ x: img.x, y: img.y, width: 80, height: 80 }}
            bounds="parent"
          >
            <img src={img.src} alt="uploaded" className="w-full h-full object-cover" />
          </Rnd>
        ))}
      </div>
      
      <button onClick={saveImage} className="bg-blue-500 text-white px-4 py-2 rounded">
        저장하기
      </button>
    </div>
  );
};

export default FeedPreview;
