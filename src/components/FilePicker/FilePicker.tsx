import React, { useState, useRef, useCallback } from "react";
import "./styles.scss";
import icons from "../../assets/icons/icons";

interface FilePickerProps {
  onFilesSelected: (files: File[]) => void;
  title: string;
  formatText: string;
}

const FilePicker: React.FC<FilePickerProps> = ({
  onFilesSelected,
  title,
  formatText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLInputElement | null>(null);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        onFilesSelected(files);
      }
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`containerFilePicker col-3 ${isDragging && "active"}`}
      onClick={() => dropzoneRef.current?.click()}
    >
      <img src={icons.addFile} className="addFileIco"></img>
      <p className="titlePicker">{title}</p>
      <p className="formatTextPicker">{formatText}</p>
      <input
        type="file"
        multiple
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        ref={dropzoneRef}
      />
    </div>
  );
};

export default FilePicker;
