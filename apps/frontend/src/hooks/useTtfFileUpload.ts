"use client";

import {
  ChangeEvent,
  DragEvent,
  type RefObject,
  useRef,
  useState,
} from "react";
import { copy } from "@/constants/copy";

function isTtfFile(file: File) {
  return file.name.toLowerCase().endsWith(".ttf");
}

export type UseTtfFileUploadResult = {
  inputRef: RefObject<HTMLInputElement | null>;
  selectedFile: File | null;
  errorMessage: string;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleDrop: (event: DragEvent<HTMLLabelElement>) => void;
  clearSelectedFile: () => void;
};

/**
 * TTF 파일 업로드 UI에서 사용하는 파일 선택 상태와 검증 로직을 관리합니다.
 * 한 번에 하나의 `.ttf` 파일만 허용하고, 선택 해제 시 input 값까지 초기화합니다.
 */
export function useTtfFileUpload(): UseTtfFileUploadResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const setFile = (file: File) => {
    if (!isTtfFile(file)) {
      setSelectedFile(null);
      setErrorMessage(copy.upload.invalidFileError);
      return;
    }

    setSelectedFile(file);
    setErrorMessage("");
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    if (files.length > 1) {
      setSelectedFile(null);
      setErrorMessage(copy.upload.multipleFilesError);
      event.target.value = "";
      return;
    }

    setFile(files[0]);
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();

    const files = event.dataTransfer.files;

    if (files.length > 1) {
      setSelectedFile(null);
      setErrorMessage(copy.upload.multipleFilesError);
      return;
    }

    if (files.length === 1) {
      setFile(files[0]);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setErrorMessage("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return {
    inputRef,
    selectedFile,
    errorMessage,
    handleFileChange,
    handleDrop,
    clearSelectedFile,
  };
}
