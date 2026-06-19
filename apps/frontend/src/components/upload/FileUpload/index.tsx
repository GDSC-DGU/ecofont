"use client";

import { StartConversionButton } from "@/components/upload/StartConversionButton";
import { copy } from "@/constants/copy";
import { useTtfFileUpload } from "@/hooks/useTtfFileUpload";
import * as styles from "./FileUpload.css";

export function FileUpload() {
  const {
    inputRef,
    selectedFile,
    errorMessage,
    handleFileChange,
    handleDrop,
    clearSelectedFile,
  } = useTtfFileUpload();

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div>
          <h2 className={styles.title}>{copy.upload.title}</h2>
          <p className={styles.description}>{copy.upload.description}</p>
        </div>
        <span className={styles.badge}>{copy.upload.badge}</span>
      </div>

      {selectedFile ? (
        <div className={styles.selectedFilePanel} aria-live="polite">
          <div className={styles.fileInfo}>
            <span className={styles.fileLabel}>
              {copy.upload.selectedFileLabel}
            </span>
            <span className={styles.fileName}>{selectedFile.name}</span>
            <span className={styles.fileStatus}>
              {copy.upload.selectedFileReady}
            </span>
          </div>
          <button
            className={styles.clearButton}
            type="button"
            onClick={clearSelectedFile}
          >
            {copy.upload.removeFileAction}
          </button>
        </div>
      ) : (
        <label
          className={styles.dropzone}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <span className={styles.uploadText}>
            <span className={styles.primaryText}>
              {copy.upload.dropzonePrimary}
            </span>
            <span className={styles.secondaryText}>
              {copy.upload.dropzoneSecondary}
            </span>
          </span>
          <input
            ref={inputRef}
            className={styles.input}
            type="file"
            accept=".ttf,font/ttf"
            onChange={handleFileChange}
          />
        </label>
      )}

      {errorMessage ? (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      ) : null}

      <StartConversionButton file={selectedFile} />
    </section>
  );
}
