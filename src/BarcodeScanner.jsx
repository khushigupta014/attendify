import React, { useRef, useEffect, useCallback } from "react";
import { BrowserMultiFormatReader, Result } from "@zxing/library";
import Webcam from "react-webcam";

const BarcodeScanner = ({
  onUpdate,
  onError,
  width = "100%",
  height = "100%",
  facingMode = "environment",
  torch,
  delay = 500,
  videoConstraints,
  stopStream,
}) => {
  const webcamRef = useRef(null);

  const capture = useCallback(() => {
    const codeReader = new BrowserMultiFormatReader();
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      codeReader
        .decodeFromImage(undefined, imageSrc)
        .then((result) => {
          onUpdate(null, result);
        })
        .catch((err) => {
          onUpdate(err);
        });
    }
  }, [onUpdate]);

  useEffect(() => {
    // Turn on the flashlight if prop is defined and device has the capability
    if (
      typeof torch === "boolean" &&
      // @ts-ignore
      navigator?.mediaDevices?.getSupportedConstraints().torch
    ) {
      const stream = webcamRef.current.video.srcObject;
      const track = stream?.getVideoTracks()[0]; // get the active track of the stream
      if (
        track &&
        track.getCapabilities().torch &&
        !track.getConstraints().torch
      ) {
        track
          .applyConstraints({
            advanced: [{ torch }],
          })
          .catch((err) => onUpdate(err));
      }
    }
  }, [torch, onUpdate]);

  useEffect(() => {
    if (stopStream) {
      let stream = webcamRef.current.video.srcObject;
      if (stream) {
        stream.getTracks().forEach((track) => {
          stream.removeTrack(track);
          track.stop();
        });
        stream = null;
      }
    }
  }, [stopStream]);

  useEffect(() => {
    const interval = setInterval(capture, delay);
    return () => {
      clearInterval(interval);
    };
  }, [capture, delay]);

  return (
    <Webcam
      width={width}
      height={height}
      ref={webcamRef}
      screenshotFormat="image/jpeg"
      videoConstraints={
        videoConstraints || {
          facingMode,
        }
      }
      audio={false}
      onUserMediaError={onError}
    />
  );
};

export default BarcodeScanner;
